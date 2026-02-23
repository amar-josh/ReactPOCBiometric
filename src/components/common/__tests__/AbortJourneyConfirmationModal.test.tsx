import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AbortJourneyConfirmationModal from "../AbortJourneyConfirmationModal";

// Mock translator to just return the key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("AbortJourneyConfirmationModal", () => {
  const mockOnCancel = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultProps = {
    open: true,
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
    description: "Are you sure you want to cancel?",
    icon: "/warning-icon.png",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with description and icon when open is true", () => {
    render(<AbortJourneyConfirmationModal {...defaultProps} />);

    expect(screen.getByRole("img", { name: /warning/i })).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to cancel?")
    ).toBeInTheDocument();
    expect(screen.getByText("button.no")).toBeInTheDocument();
    expect(screen.getByText("button.yesCancel")).toBeInTheDocument();
  });

  it("does not render modal when open is false", () => {
    render(<AbortJourneyConfirmationModal {...defaultProps} open={false} />);
    expect(
      screen.queryByText("Are you sure you want to cancel?")
    ).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<AbortJourneyConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText("button.no"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when confirm button is clicked", () => {
    render(<AbortJourneyConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText("button.yesCancel"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("renders with custom confirm and cancel labels", () => {
    render(
      <AbortJourneyConfirmationModal
        {...defaultProps}
        confirmLabel="custom.confirm"
        cancelLabel="custom.cancel"
      />
    );
    expect(screen.getByText("custom.cancel")).toBeInTheDocument();
    expect(screen.getByText("custom.confirm")).toBeInTheDocument();
  });
});
