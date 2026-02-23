import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReKYCDetails from "../components/ReKYCDetails";

//   it("renders all action buttons", () => {
//     setup();

vi.mock("@/components/common/AlertMessage", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="alert-message">{message}</div>
  ),
}));

vi.mock("@/components/common/InfoMessage", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="info-message">{message}</div>
  ),
}));

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

/* ------------------------------------------------------------------ */

const mockReKYCDetails: any = {
  rekycDetails: {
    permanentAddress: {},
    communicationAddress: {},
  },
  metaData: {
    isNoChange: true,
    isUpdateAddress: true,
    message: "",
  },
};

const setup = (overrides = {}) => {
  const props = {
    reKYCDetails: { ...mockReKYCDetails, ...overrides },
    handleContinueToEsign: vi.fn(),
    handleUpdateCommunicationAddress: vi.fn(),
    handleShowCancelModal: vi.fn(),
    setIsOtherDetailsChange: vi.fn(),
  };

  render(<ReKYCDetails {...props} />);
  return props;
};

describe("ReKYCDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------------------------- */
  /* -------------------------- RENDER ----------------------------- */
  /* --------------------------------------------------------------- */

  it("renders all action buttons", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "button.reKycWithNoChange" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "button.cancel" })
    ).toBeInTheDocument();
  });

  /* --------------------------------------------------------------- */
  /* ----------------------- BUTTON STATES ------------------------- */
  /* --------------------------------------------------------------- */

  it("disables No Change button when isNoChange is false", () => {
    setup({
      metaData: { isNoChange: false, isUpdateAddress: true },
    });

    expect(
      screen.getByRole("button", { name: "button.reKycWithNoChange" })
    ).toBeDisabled();
  });

  it("enables No Change button when isNoChange is true", () => {
    setup({
      metaData: { isNoChange: true, isUpdateAddress: false },
    });

    expect(
      screen.getByRole("button", { name: "button.reKycWithNoChange" })
    ).not.toBeDisabled();
  });

  /* --------------------------------------------------------------- */
  /* ------------------------- ACTIONS ----------------------------- */
  /* --------------------------------------------------------------- */

  it("calls handleContinueToEsign on No Change click", () => {
    const props = setup();

    fireEvent.click(
      screen.getByRole("button", { name: "button.reKycWithNoChange" })
    );

    expect(props.handleContinueToEsign).toHaveBeenCalledTimes(1);
  });

  it("calls handleShowCancelModal on Cancel click from actions section", () => {
    const props = setup();

    fireEvent.click(screen.getByRole("button", { name: "button.cancel" }));

    expect(props.handleShowCancelModal).toHaveBeenCalledTimes(1);
  });

  it("calls handleShowCancelModal on Cancel click", () => {
    const props = setup();

    fireEvent.click(screen.getByRole("button", { name: "button.cancel" }));

    expect(props.handleShowCancelModal).toHaveBeenCalledTimes(1);
  });

  /* --------------------------------------------------------------- */
  /* ------------------------- MESSAGES ---------------------------- */
  /* --------------------------------------------------------------- */

  it("shows AlertMessage when metaData.message exists", () => {
    setup({
      metaData: {
        isNoChange: true,
        isUpdateAddress: true,
        message: "Warning message",
      },
    });

    expect(screen.getByTestId("alert-message")).toHaveTextContent(
      "Warning message"
    );
  });

  it("shows InfoMessage when both actions are disabled", () => {
    setup({
      metaData: {
        isNoChange: false,
        isUpdateAddress: false,
      },
    });

    expect(screen.getByTestId("info-message")).toBeInTheDocument();
  });
});
