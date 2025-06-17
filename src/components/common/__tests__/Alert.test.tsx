import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

describe("Alert", () => {
  it("renders Alert with default variant", () => {
    render(
      <Alert>
        <AlertTitle>Default Title</AlertTitle>
        <AlertDescription>This is a default alert</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Default Title")).toBeInTheDocument();
    expect(screen.getByText("This is a default alert")).toBeInTheDocument();
  });

  it("renders Alert with destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This is an error alert</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("text-destructive");
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("This is an error alert")).toBeInTheDocument();
  });

  it("allows custom className to be applied", () => {
    render(
      <Alert className="custom-alert-class">
        <AlertTitle>Custom</AlertTitle>
        <AlertDescription>Styled alert</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveClass("custom-alert-class");
  });

  it("applies correct slots and structure", () => {
    render(
      <Alert>
        <AlertTitle data-testid="alert-title">Heading</AlertTitle>
        <AlertDescription data-testid="alert-description">
          Message
        </AlertDescription>
      </Alert>
    );

    expect(screen.getByTestId("alert-title")).toHaveAttribute(
      "data-slot",
      "alert-title"
    );
    expect(screen.getByTestId("alert-description")).toHaveAttribute(
      "data-slot",
      "alert-description"
    );
  });
});
