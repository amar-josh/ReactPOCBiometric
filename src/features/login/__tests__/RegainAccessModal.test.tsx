import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RegainAccessModal from "../components/RegainAccessModal";

// Mock the translator to return the key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("RegainAccessModal", () => {
  it("renders modal content when open", () => {
    const setShowModal = vi.fn();

    render(<RegainAccessModal showModal={true} setShowModal={setShowModal} />);

    // Title
    expect(screen.getByText("login.regainAccountAccess")).toBeInTheDocument();

    // Displayed phone number
    expect(
      screen.getByText("instaservice_support@bandhanbank.com")
    ).toBeInTheDocument();

    // Close button
    expect(
      screen.getByRole("button", { name: "button.close" })
    ).toBeInTheDocument();
  });

  it("calls setShowModal(false) when close button is clicked", () => {
    const setShowModal = vi.fn();

    render(<RegainAccessModal showModal={true} setShowModal={setShowModal} />);

    const closeButton = screen.getByRole("button", { name: "button.close" });
    fireEvent.click(closeButton);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("does not render content when showModal is false", () => {
    const setShowModal = vi.fn();

    render(<RegainAccessModal showModal={false} setShowModal={setShowModal} />);

    expect(
      screen.queryByText("login.regainAccountAccess")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("1234-567-0000")).not.toBeInTheDocument();
  });
});
