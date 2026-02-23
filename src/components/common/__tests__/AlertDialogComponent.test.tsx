import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import AlertDialogComponent from "../AlertDialogComponent";

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("AlertDialogComponent", () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    title: "alert.title",
    message: "alert.message",
    icon: "test-icon.svg",
    open: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    type: "info" as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders title, message, and icon", () => {
    render(<AlertDialogComponent {...defaultProps} />);

    expect(screen.getByText("alert.title")).toBeInTheDocument();
    expect(screen.getByText("alert.message")).toBeInTheDocument();

    const icon = screen.getByAltText("image") as HTMLImageElement;
    expect(icon.src).toContain("test-icon.svg");
  });

  test("calls onConfirm with uniqueKey when confirm button is clicked", () => {
    render(<AlertDialogComponent {...defaultProps} uniqueKey="KEY-123" />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(mockOnConfirm).toHaveBeenCalledWith("KEY-123");
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(<AlertDialogComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("shows loader icon when isLoading is true", () => {
    render(<AlertDialogComponent {...defaultProps} isLoading />);

    expect(screen.getByRole("img", { hidden: true })).toHaveClass(
      "mx-auto mb-4"
    );
  });

  test("does not render confirm or cancel button if not provided", () => {
    render(
      <AlertDialogComponent
        title="alert.title"
        message="alert.message"
        icon="test-icon.svg"
        open={true}
      />
    );

    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  test("applies correct message color based on type", () => {
    const { rerender } = render(
      <AlertDialogComponent {...defaultProps} type="info" />
    );
    expect(screen.getByText("alert.message")).toHaveClass("text-info");

    rerender(<AlertDialogComponent {...defaultProps} type="warning" />);
    expect(screen.getByText("alert.message")).toHaveClass("text-warning");

    rerender(<AlertDialogComponent {...defaultProps} type="error" />);
    expect(screen.getByText("alert.message")).toHaveClass("text-danger");
  });
});
