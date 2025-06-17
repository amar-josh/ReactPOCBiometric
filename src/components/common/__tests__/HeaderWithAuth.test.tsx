import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";

import Header from "../HeaderWithAuth";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("Header", () => {
  const mockLogout = vi.fn();

  const defaultProps = {
    name: "John Doe",
    branch: "Mumbai",
    handleLogout: mockLogout,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo with alt text", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByAltText("Bandhan Bank")).toBeInTheDocument();
  });

  it("displays user name and branch info correctly", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(
      screen.getByText(`header.branchOrBu:${defaultProps.branch}`)
    ).toBeInTheDocument();
  });

  it("renders logout text and calls handleLogout when clicked", () => {
    render(<Header {...defaultProps} />);
    const logoutText = screen.getByText("header.logout");
    expect(logoutText).toBeInTheDocument();

    const logoutDiv = logoutText.closest("div");
    expect(logoutDiv).toBeInTheDocument();

    if (logoutDiv) {
      fireEvent.click(logoutDiv);
    }

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("shows AvatarFallback initials when image src is empty", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
