import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getSessionStorageData,
  setSessionStorageData,
} from "@/lib/sessionStorage";

import SessionExpired from "../SessionExpired";

// ✅ Setup: Mock useNavigate and translator
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

const SESSION_TOKEN_KEY = "token"; // Or use your actual SESSION_STORAGE_KEY.TOKEN

describe("SessionExpired", () => {
  beforeEach(() => {
    setSessionStorageData(SESSION_TOKEN_KEY, "dummyToken");
    mockNavigate.mockClear(); // Reset the mock between tests
  });

  it("renders session expired message and login button", () => {
    render(<SessionExpired />);

    expect(screen.getByAltText("Session Expired")).toBeInTheDocument();
    expect(screen.getByText("sessionExpired.message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "button.backToLogin" })
    ).toBeInTheDocument();
  });

  it("clears session token and navigates to login on button click", () => {
    render(<SessionExpired />);

    const button = screen.getByRole("button", { name: "button.backToLogin" });
    fireEvent.click(button);

    expect(getSessionStorageData<string>(SESSION_TOKEN_KEY)).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
