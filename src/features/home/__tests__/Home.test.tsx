import { fireEvent, render, screen } from "@testing-library/react";
import * as ReactRouter from "react-router";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import * as alertHook from "@/hooks/useAlertMessage";

import Home from "..";
import * as useInstaHook from "../hooks";

// Mocking navigate from react-router
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof ReactRouter>("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock child component
vi.mock("../component/HomePage", () => ({
  default: ({ onHandleClick, instaServices, alertMessage }: any) => (
    <div>
      <div data-testid="home-component">
        {instaServices?.map((item: any) => <p key={item.key}>{item.key}</p>)}
      </div>
      {alertMessage?.message && <div>{alertMessage.message}</div>}
      <button onClick={onHandleClick}>Navigate</button>
    </div>
  ),
}));

// Mock loader
vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div>Loading...</div>,
}));

describe("Home", () => {
  const mockNavigate = vi.fn();
  const mockAlertMessage = {
    alertMessage: null,
  };

  beforeEach(() => {
    vi.mocked(ReactRouter.useNavigate).mockReturnValue(mockNavigate);
    vi.spyOn(alertHook, "useAlertMessage").mockReturnValue(mockAlertMessage);
  });

  it("shows loader when loading", () => {
    vi.spyOn(useInstaHook, "useGetInstaServices").mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    });

    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows alert when error occurs", async () => {
    vi.spyOn(useInstaHook, "useGetInstaServices").mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: { message: "Something went wrong" },
    });

    vi.spyOn(alertHook, "useAlertMessage").mockReturnValue({
      alertMessage: { type: "error", message: "Something went wrong" },
    });

    render(<Home />, { wrapper: MemoryRouter });
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
