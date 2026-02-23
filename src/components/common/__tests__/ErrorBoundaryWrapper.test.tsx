import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ErrorBoundaryWrapper from "../ErrorBoundaryWrapper";
import { ROUTES } from "@/routes/constants";
import { getSessionStorageData } from "@/lib/sessionStorage";

/* ------------------------------------------------------------------ */
/* ----------------------------- MOCKS -------------------------------- */
/* ------------------------------------------------------------------ */

const navigateSpy = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
    useLocation: () => ({ pathname: "/test-path" }),
  };
});

vi.mock("@/routes/constants", () => ({
  ROUTES: {
    HOME: "/home",
    LOGIN: "/login",
  },
}));

vi.mock("@/lib/sessionStorage", () => ({
  getSessionStorageData: vi.fn(),
}));

vi.mock("../AccessErrorCard", () => ({
  __esModule: true,
  default: ({
    title,
    description,
    primaryButtonText,
    onClickPrimaryButton,
  }: any) => (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <button onClick={onClickPrimaryButton}>{primaryButtonText}</button>
    </div>
  ),
}));

// Always render fallback for predictable testing
vi.mock("../ErrorBoundary", () => ({
  __esModule: true,
  ErrorBoundary: ({ fallback }: any) => fallback,
}));

/* ------------------------------------------------------------------ */
/* ------------------------------ TESTS ------------------------------- */
/* ------------------------------------------------------------------ */

describe("ErrorBoundaryWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fallback with login button when token is absent", () => {
    (getSessionStorageData as any).mockReturnValue(null);

    render(
      <MemoryRouter>
        <ErrorBoundaryWrapper>
          <div>Child</div>
        </ErrorBoundaryWrapper>
      </MemoryRouter>
    );

    expect(screen.getByText("reKyc.errorMessages.oops")).toBeInTheDocument();

    expect(
      screen.getByText("reKyc.errorMessages.somethingWentWrong")
    ).toBeInTheDocument();

    expect(screen.getByText("button.backToLogin")).toBeInTheDocument();
  });

  it("navigates to LOGIN when token is absent", () => {
    (getSessionStorageData as any).mockReturnValue(null);

    render(
      <MemoryRouter>
        <ErrorBoundaryWrapper>
          <div>Child</div>
        </ErrorBoundaryWrapper>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("button.backToLogin"));

    expect(navigateSpy).toHaveBeenCalledWith(ROUTES.LOGIN, {
      replace: true,
    });
  });

  it("renders home button when token is present", () => {
    (getSessionStorageData as any).mockReturnValue("mock-token");

    render(
      <MemoryRouter>
        <ErrorBoundaryWrapper>
          <div>Child</div>
        </ErrorBoundaryWrapper>
      </MemoryRouter>
    );

    expect(screen.getByText("button.backToHome")).toBeInTheDocument();
  });

  it("navigates to HOME when token is present", () => {
    (getSessionStorageData as any).mockReturnValue("mock-token");

    render(
      <MemoryRouter>
        <ErrorBoundaryWrapper>
          <div>Child</div>
        </ErrorBoundaryWrapper>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("button.backToHome"));

    expect(navigateSpy).toHaveBeenCalledWith(ROUTES.HOME, {
      replace: true,
    });
  });
});
