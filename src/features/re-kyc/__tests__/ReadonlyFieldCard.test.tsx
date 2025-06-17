import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ReadonlyFieldCard from "../components/ReadonlyFieldCard";

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => `translated(${key})`,
}));

describe("ReadonlyFieldCard", () => {
  const mockFields = [
    {
      label: "reKyc.firstName",
      type: "text",
      defaultValue: "John",
      value: "John",
    },
    {
      label: "reKyc.bio",
      type: "textarea",
      defaultValue: "A short bio about John",
      value: "A short bio about John",
    },
  ];

  it("renders the card title", () => {
    render(<ReadonlyFieldCard title="Personal Info" fields={mockFields} />);
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  it("renders all field labels using translator", () => {
    render(<ReadonlyFieldCard title="Personal Info" fields={mockFields} />);
    expect(screen.getByText("translated(reKyc.firstName)")).toBeInTheDocument();
    expect(screen.getByText("translated(reKyc.bio)")).toBeInTheDocument();
  });

  it("renders an input field for text type", () => {
    render(<ReadonlyFieldCard title="Personal Info" fields={mockFields} />);
    const input = screen.getByDisplayValue("John") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.disabled).toBe(true);
    expect(input.type).toBe("text");
  });

  it("renders a textarea field for textarea type", () => {
    render(<ReadonlyFieldCard title="Personal Info" fields={mockFields} />);
    const textarea = screen.getByDisplayValue(
      "A short bio about John"
    ) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.disabled).toBe(true);
  });

  it("renders correct number of fields", () => {
    render(<ReadonlyFieldCard title="Personal Info" fields={mockFields} />);
    expect(screen.getAllByRole("textbox").length).toBe(2); // input and textarea
  });
});
