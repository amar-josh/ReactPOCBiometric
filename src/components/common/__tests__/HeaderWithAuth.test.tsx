import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import translator from "@/i18n/translator";

import Header from "../HeaderWithAuth";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("HeaderWithAuth", () => {
  const mockLogout = vi.fn();

  const mockGetInitials = (name?: string | null): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  const defaultProps = {
    name: "John Doe",
    branch: "Mumbai",
    handleLogout: mockLogout,
    getInitials: mockGetInitials,
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
      screen.getByText(
        `${translator("header.branchOrBu")}: ${defaultProps.branch}`
      )
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

  it("shows correct initials for a different name", () => {
    render(<Header {...defaultProps} name="Rahul Sharma" />);
    expect(screen.getByText("RS")).toBeInTheDocument();
  });

  it("shows empty initials when name is null", () => {
    render(<Header {...defaultProps} name={null} />);
    expect(screen.queryByText("JD")).not.toBeInTheDocument();
  });

  it("displays '-' when branch is null", () => {
    render(<Header {...defaultProps} branch={null} />);
    expect(
      screen.getByText(`${translator("header.branchOrBu")}: -`)
    ).toBeInTheDocument();
  });
});
