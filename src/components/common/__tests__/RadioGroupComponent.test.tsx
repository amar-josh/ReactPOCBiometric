import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

import RadioGroupComponent from "../RadioGroupComponent";

describe("RadioGroupComponent", () => {
  let mockOnChange: Mock;

  const options = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Guest", value: "guest" },
  ];

  beforeEach(() => {
    mockOnChange = vi.fn();
  });

  test("renders the radio buttons with correct labels", () => {
    render(
      <RadioGroupComponent value="" onChange={mockOnChange} options={options} />
    );

    // Check if all options are rendered
    options.forEach((option) => {
      expect(screen.getByLabelText(option.label)).toBeInTheDocument();
    });
  });

  test("calls onChange when a radio option is selected", () => {
    render(
      <RadioGroupComponent value="" onChange={mockOnChange} options={options} />
    );

    // Select the 'Admin' option
    fireEvent.click(screen.getByLabelText("Admin"));

    // Check if onChange is called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith("admin");
  });

  test("displays the selected option", () => {
    const selectedValue = "user";
    render(
      <RadioGroupComponent
        value={selectedValue}
        onChange={mockOnChange}
        options={options}
      />
    );

    // Ensure that the correct radio button is checked
    expect(screen.getByLabelText("User")).toBeChecked();
  });

  test("does not call onChange if the same radio button is clicked", () => {
    render(
      <RadioGroupComponent
        value="admin"
        onChange={mockOnChange}
        options={options}
      />
    );

    // Click the already selected 'Admin' option
    fireEvent.click(screen.getByLabelText("Admin"));

    // Ensure onChange is not called
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
