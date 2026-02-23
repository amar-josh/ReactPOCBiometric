import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "..";

const mocks = {
  navigate: vi.fn(),
  setKey: vi.fn(),
  setTransactionId: vi.fn(),
  getConfig: vi.fn(),
};
let mockConfigData: any = null;

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/features/home/component/HomeCard", () => ({
  default: ({
    label,
    description,
    onClick,
  }: {
    label: string;
    description: string;
    onClick: () => void;
  }) => (
    <div onClick={onClick} data-testid="home-card">
      <span>{label}</span>
      <p>{description}</p>
    </div>
  ),
}));

// ✅ Mock getIconBasedOnModuleKey
vi.mock("../utils", () => ({
  getIconBasedOnModuleKey: (key: string) => `Icon-${key}`,
}));

vi.mock("../constants", () => ({
  INSTA_SERVICES_CARDS: [
    {
      key: "re_kyc",
      icon: "Icon-re_kyc",
      name: "home.instaServices.reKYCTitle",
      description: "home.instaServices.reKYCDescription",
      path: "/re-kyc",
    },
    {
      key: "mobile_number_update",
      icon: "Icon-mobile_number_update",
      name: "home.instaServices.mobileNumberUpdateTitle",
      description: "home.instaServices.mobileNumberUpdateDescription",
      path: "/mobile-number-update",
    },
  ],
  NAVIGATION_ROUTES: {
    re_kyc: "/re-kyc",
    mobile_number_update: "/mobile-number-update",
  },
}));

vi.mock("@/lib/encryptionDecryption", () => ({
  aesGcmUtil: { setKey: (key: string) => mocks.setKey(key) },
}));
vi.mock("@/lib/utils", () => ({
  setTransactionId: (id: string) => mocks.setTransactionId(id),
}));

vi.mock("../adfs-login/hooks", () => ({
  useEmpInfo: () => ({ empName: "John Doe" }),
}));

vi.mock("@/hooks/useConfig", () => ({
  useGetConfig: () => ({
    mutate: mocks.getConfig,
    data: mockConfigData,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockConfigData = null;
});

describe("Home Component", () => {
  it("calls getConfig on mount", async () => {
    render(<Home />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mocks.getConfig).toHaveBeenCalledTimes(1);
    });
  });

  it("sets aes key and transaction ID when configData is available", async () => {
    mockConfigData = { data: { aesKey: "dummyKey" } };

    render(<Home />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mocks.setKey).toHaveBeenCalledWith("dummyKey");
      expect(mocks.setTransactionId).toHaveBeenCalledWith("");
    });
  });

  it("renders all HomeCards correctly", () => {
    render(<Home />, { wrapper: MemoryRouter });

    const cards = screen.getAllByTestId("home-card");
    expect(cards).toHaveLength(2);

    expect(
      screen.getByText("home.instaServices.reKYCTitle")
    ).toBeInTheDocument();
    expect(
      screen.getByText("home.instaServices.mobileNumberUpdateTitle")
    ).toBeInTheDocument();
  });

  it("navigates correctly on card click", () => {
    render(<Home />, { wrapper: MemoryRouter });

    const cards = screen.getAllByTestId("home-card");

    fireEvent.click(cards[0]);
    expect(mocks.navigate).toHaveBeenLastCalledWith("/re-kyc");

    fireEvent.click(cards[1]);
    expect(mocks.navigate).toHaveBeenLastCalledWith("/mobile-number-update");
  });
});
