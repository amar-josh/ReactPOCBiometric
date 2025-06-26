import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import Home from "..";

// ✅ Mock useNavigate
// ✅ Fix: partial mock of `react-router`
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ✅ Mock translator to return key
vi.mock("../../../i18n/translator", () => ({
  default: (key: string) => key,
}));

// ✅ Mock HomeCard
interface HomeCardProps {
  label: string;
  description: string;
  onClick: () => void;
}

vi.mock("../../../features/home/component/HomeCard", () => ({
  default: ({ label, description, onClick }: HomeCardProps) => (
    <div onClick={onClick} data-testid="home-card">
      <div>{label}</div>
      <div>{description}</div>
    </div>
  ),
}));

// ✅ Mock getIconBasedOnModuleKey
vi.mock("../utils", () => ({
  getIconBasedOnModuleKey: (key: string) => `Icon-${key}`,
}));

// ✅ Stub card data
vi.mock("../constants", () => ({
  INSTA_SERVICES_CARDS: [
    {
      moduleKey: "re_kyc",
      moduleName: "Re-KYC",
      moduleDesc: "Update your KYC information",
    },
    {
      moduleKey: "mobile_number_update",
      moduleName: "Mobile Update",
      moduleDesc: "Change your mobile number",
    },
  ],
}));

describe("Home Component", () => {
  it("renders welcome and subtitle texts", () => {
    render(<Home />, { wrapper: MemoryRouter });

    expect(screen.getByText("home.subTitle")).toBeInTheDocument();
  });

  it("renders all HomeCards", () => {
    render(<Home />, { wrapper: MemoryRouter });

    const cards = screen.getAllByTestId("home-card");
    expect(cards).toHaveLength(2);

    expect(screen.getByText("Re-KYC")).toBeInTheDocument();
    expect(screen.getByText("Update your KYC information")).toBeInTheDocument();
    expect(screen.getByText("Mobile Update")).toBeInTheDocument();
    expect(screen.getByText("Change your mobile number")).toBeInTheDocument();
  });

  it("navigates correctly when cards are clicked", () => {
    render(<Home />, { wrapper: MemoryRouter });

    const cards = screen.getAllByTestId("home-card");
    fireEvent.click(cards[0]); // re_kyc
    expect(mockNavigate).toHaveBeenCalledWith("/re-kyc");

    fireEvent.click(cards[1]); // mobile_number_update
    expect(mockNavigate).toHaveBeenCalledWith("/mobile-number-update");
  });
});
