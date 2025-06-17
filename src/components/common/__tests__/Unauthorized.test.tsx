import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Unauthorized from "../Unauthorized";

// ✅ Mock dependencies
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/constants/globalConstant", () => ({
  SESSION_STORAGE_KEY: {
    TOKEN: "token",
  },
}));

vi.mock("@/routes/constants", () => ({
  ROUTES: {
    LOGIN: "/login",
  },
}));

vi.mock("../AccessErrorCard", () => ({
  default: ({ title, description, onClickPrimaryButton }: any) => (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClickPrimaryButton}>Back to login</button>
    </div>
  ),
}));

describe("Unauthorized", () => {
  beforeEach(() => {
    sessionStorage.setItem("token", "dummy-token");
    mockNavigate.mockClear();
  });

  it("renders AccessErrorCard with correct props", () => {
    render(<Unauthorized />);

    expect(screen.getByText("unauthorized.title")).toBeInTheDocument();
    expect(screen.getByText("unauthorized.message")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to login" })
    ).toBeInTheDocument();
  });

  it("clears token and navigates to login on button click", () => {
    render(<Unauthorized />);

    fireEvent.click(screen.getByRole("button", { name: "Back to login" }));

    expect(sessionStorage.getItem("token")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
