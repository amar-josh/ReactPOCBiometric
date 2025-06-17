import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import AlertMessage from "../AlertMessage";

describe("AlertMessage", () => {
  const message = "Test alert message";

  test("renders success alert correctly", () => {
    render(<AlertMessage type="success" message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(message).parentElement?.parentElement).toHaveClass(
      "bg-success-background text-success border-success-bd"
    );
  });

  test("renders warning alert correctly", () => {
    render(<AlertMessage type="warning" message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(message).parentElement?.parentElement).toHaveClass(
      "bg-warning-background text-warning border-warning-bd"
    );
  });

  test("renders error alert correctly", () => {
    render(<AlertMessage type="error" message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(message).parentElement?.parentElement).toHaveClass(
      "bg-danger-background text-danger border-danger-bd"
    );
  });

  test("renders info alert correctly", () => {
    render(<AlertMessage type="info" message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(message).parentElement?.parentElement).toHaveClass(
      "bg-info-background text-info border-info-bd"
    );
  });
});
