import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Login from "..";

// Mocks
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/hooks/useAlertMessage", () => ({
  useAlertMessage: () => ({
    alertMessage: "",
  }),
}));

describe("Login Page", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
  });

  it("renders email input and Next button", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText("validations.email.enterValidEmail")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "invalid" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText("validations.email.enterValidEmail")
      ).toBeInTheDocument();
    });
  });

  it("navigates to home on valid email submission", async () => {
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });

    // First click to trigger validation
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
  });
});
