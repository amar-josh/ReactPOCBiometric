import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { ILabelValue } from "@/features/re-kyc/types";

import { ComboBox } from "../ComboBox";

const options: ILabelValue[] = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
  { label: "Option C", value: "c" },
];

describe("ComboBox", () => {
  test("renders with default text when no value is selected", () => {
    render(<ComboBox list={options} />);
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Select an option..."
    );
  });

  test("renders with selected value", () => {
    render(<ComboBox list={options} value="b" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Option B");
  });

  test("opens and displays options when clicked", () => {
    render(<ComboBox list={options} />);
    fireEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  test("filters options based on search input", () => {
    render(<ComboBox list={options} />);
    fireEvent.click(screen.getByRole("combobox"));
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Option B" } });
    expect(screen.queryByText("Option A")).not.toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  test("calls onChange with correct value", () => {
    const handleChange = vi.fn();
    render(<ComboBox list={options} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Option C"));
    expect(handleChange).toHaveBeenCalledWith({
      label: "Option C",
      value: "c",
    });
  });

  test("renders red border when error=true", () => {
    render(<ComboBox list={options} error />);
    const button = screen.getByRole("combobox");
    expect(button).toHaveClass("border-red-500");
  });
});
