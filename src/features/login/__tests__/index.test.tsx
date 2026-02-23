import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { aesGcmUtil } from "@/lib/encryptionDecryption";
import { setTransactionId } from "@/lib/utils";
import { ROUTES } from "@/routes/constants";

import Login from "..";

/* ------------------------------------------------------------------ */
/* ------------------------------ MOCKS ----------------------------- */
/* ------------------------------------------------------------------ */

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockGetConfigMutate = vi.fn();
let mockConfigResponse: any = { data: { aesKey: "mock-aes-key" } };

vi.mock("@/hooks/useConfig", () => ({
  useGetConfig: () => ({
    mutate: mockGetConfigMutate,
    data: mockConfigResponse,
  }),
}));

vi.mock("@/lib/encryptionDecryption", () => ({
  aesGcmUtil: { setKey: vi.fn() },
}));

vi.mock("@/lib/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/utils")>();
  return { ...actual, setTransactionId: vi.fn() };
});

vi.mock("@/lib/sessionStorage", () => ({
  setSessionStorageData: vi.fn(),
}));

vi.mock("@/services/api.service", () => ({
  updateTokenValue: vi.fn(),
}));

const loginMutateMock = vi.fn();
let mockIsPending = false;

vi.mock("../hooks", () => ({
  useLogin: () => ({
    mutate: loginMutateMock,
    isPending: mockIsPending,
  }),
}));

vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

/* -------- Mock RegainAccessModal -------- */
vi.mock("../components/RegainAccessModal", () => ({
  default: ({ showModal, setShowModal }: any) =>
    showModal ? (
      <div>
        <p>login.regainAccountAccess</p>
        <button onClick={() => setShowModal(false)}>button.close</button>
      </div>
    ) : null,
}));

/* ------------------------------------------------------------------ */
/* ------------------------- TEST SETUP ----------------------------- */
/* ------------------------------------------------------------------ */

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

/* ------------------------------------------------------------------ */
/* -------------------------- TEST SUITE ---------------------------- */
/* ------------------------------------------------------------------ */

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPending = false;
    mockConfigResponse = { data: { aesKey: "mock-aes-key" } };
  });

  it("calls getConfig and sets AES key + transaction id on mount", async () => {
    renderComponent();

    expect(mockGetConfigMutate).toHaveBeenCalled();

    await waitFor(() => {
      expect(aesGcmUtil.setKey).toHaveBeenCalledWith("mock-aes-key");
      expect(setTransactionId).toHaveBeenCalledWith("");
    });
  });

  it("performs a successful login flow", async () => {
    loginMutateMock.mockImplementation((_, options) => {
      options.onSuccess({
        data: {
          cognitoToken: "jwt-123",
          userAttributes: { empName: "John Doe" },
        },
      });
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("login.userId"), {
      target: { value: "john_doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("login.password"), {
      target: { value: "Password@123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "button.login" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  it("handles missing userAttributes during success gracefully", async () => {
    loginMutateMock.mockImplementation((_, options) => {
      options.onSuccess({
        data: { cognitoToken: "jwt-123" },
      });
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("login.userId"), {
      target: { value: "john_doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("login.password"), {
      target: { value: "Password@123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "button.login" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  it("displays loader and disables button while login is pending", () => {
    mockIsPending = true;
    renderComponent();

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "button.login" })).toBeDisabled();
  });

  it("opens and closes RegainAccessModal", async () => {
    renderComponent();

    fireEvent.click(screen.getByText(/login.cantAccessYourAccount/i));

    expect(screen.getByText("login.regainAccountAccess")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "button.close" }));

    await waitFor(() => {
      expect(
        screen.queryByText("login.regainAccountAccess")
      ).not.toBeInTheDocument();
    });
  });
});
