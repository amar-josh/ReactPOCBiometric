import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EligibilityCard from "../components/EligibilityCard";

// Mock SVG imports
vi.mock("@/assets/images/user.svg", () => ({ default: "user.svg" }));
vi.mock("@/assets/images/aadhaarGray.svg", () => ({
  default: "aadhaarGray.svg",
}));
vi.mock("@/assets/images/risk.svg", () => ({ default: "risk.svg" }));
vi.mock("@/assets/images/eligibility.svg", () => ({
  default: "eligibility.svg",
}));

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("EligibilityCard", () => {
  it("renders the title correctly", () => {
    render(<EligibilityCard />);
    expect(
      screen.getByText("instaServiceEligibilityCard.title")
    ).toBeInTheDocument();
  });

  it("renders all three eligibility list items", () => {
    render(<EligibilityCard />);
    expect(
      screen.getByText("instaServiceEligibilityCard.eligibilityOne")
    ).toBeInTheDocument();
    expect(
      screen.getByText("instaServiceEligibilityCard.eligibilityTwo")
    ).toBeInTheDocument();
    expect(
      screen.getByText("instaServiceEligibilityCard.eligibilityThree")
    ).toBeInTheDocument();
  });

  it("renders all icons with correct alt text", () => {
    render(<EligibilityCard />);
    expect(screen.getByAltText("user")).toBeInTheDocument();
    expect(screen.getByAltText("aadhaar")).toBeInTheDocument();
    expect(screen.getByAltText("risk")).toBeInTheDocument();
    expect(screen.getByAltText("eligibility")).toBeInTheDocument();
  });

  it("renders the main layout elements", () => {
    render(<EligibilityCard />);
    const card = screen
      .getByText("instaServiceEligibilityCard.title")
      .closest("div");
    expect(card).toBeInTheDocument();
  });
});
