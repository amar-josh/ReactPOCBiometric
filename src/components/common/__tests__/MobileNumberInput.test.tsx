import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import MobileNumberInput from "../MobileNumberInput";

describe("MobileNumberInput", () => {
  test("renders with label and required asterisk", () => {
    render(<MobileNumberInput label="Mobile Number" required />);

    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  test("renders with default country code +91", () => {
    render(<MobileNumberInput />);

    expect(screen.getByText("reKyc.plusNinetyOne")).toBeInTheDocument();
  });

  test("calls onChange with only digits", () => {
    const handleChange = vi.fn();
    render(<MobileNumberInput onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc1234!@56" } });

    expect(handleChange).toHaveBeenCalledWith("123456");
  });

  test("renders with initial value", () => {
    render(<MobileNumberInput value="9876543210" />);
    expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument();
  });

  test("disables input when disabled=true", () => {
    render(<MobileNumberInput disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("uses provided name and placeholder", () => {
    render(
      <MobileNumberInput name="contact" placeholder="Enter mobile number" />
    );
    const input = screen.getByPlaceholderText("Enter mobile number");
    expect(input).toHaveAttribute("name", "contact");
    expect(input).toHaveAttribute("id", "contact");
  });
});
