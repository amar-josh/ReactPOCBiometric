import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PasswordInput from "../PasswordInput"; // Adjust path as needed

describe("PasswordInput Component", () => {
  it("renders correctly with initial password type", () => {
    render(<PasswordInput placeholder="Enter password" />);

    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when the eye icon is clicked", () => {
    render(<PasswordInput placeholder="Enter password" />);

    const input = screen.getByPlaceholderText("Enter password");
    const toggleButton = screen.getByRole("button");

    // Initial state: password
    expect(input).toHaveAttribute("type", "password");

    // Click to show password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide password
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards extra props to the underlying Input component", () => {
    const onChange = vi.fn();
    render(
      <PasswordInput
        placeholder="Enter password"
        name="test-password"
        onChange={onChange}
        disabled
      />
    );

    const input = screen.getByPlaceholderText("Enter password");

    expect(input).toHaveAttribute("name", "test-password");
    expect(input).toBeDisabled();

    fireEvent.change(input, { target: { value: "new-password" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("applies custom className while keeping base padding", () => {
    render(
      <PasswordInput placeholder="Enter password" className="custom-class" />
    );

    const input = screen.getByPlaceholderText("Enter password");

    // Should have the custom class and the pr-10 class from PasswordInput
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveClass("pr-10");
  });

  it("button has type='button' to prevent form submission", () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button");

    // This is crucial for accessibility and preventing accidental form submits
    expect(toggleButton).toHaveAttribute("type", "button");
  });

  it("button has tabIndex={-1} to exclude it from tab sequence", () => {
    render(<PasswordInput />);
    const toggleButton = screen.getByRole("button");

    // Verifies the tabIndex prop is applied
    expect(toggleButton).toHaveAttribute("tabindex", "-1");
  });

  it("renders the correct icon based on visibility state", () => {
    const { container } = render(<PasswordInput />);
    const toggleButton = screen.getByRole("button");

    // Note: Lucide icons render as SVG. We check for the presence of the icon or class
    // Initially showing Eye (not EyeOff)
    expect(container.querySelector(".lucide-eye")).toBeInTheDocument();
    expect(container.querySelector(".lucide-eye-off")).not.toBeInTheDocument();

    // Toggle
    fireEvent.click(toggleButton);

    expect(container.querySelector(".lucide-eye-off")).toBeInTheDocument();
    expect(container.querySelector(".lucide-eye")).not.toBeInTheDocument();
  });
});
