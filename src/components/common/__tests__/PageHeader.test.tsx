import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";

import PageHeader from "../PageHeader";

const navigateSpy = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

vi.mock("@/routes/constants", () => ({
  ROUTES: { HOME: "/home" },
}));

vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

describe("PageHeader", () => {
  it("renders title and navigates back to home on click", () => {
    render(
      <MemoryRouter>
        <PageHeader title="mobileNumberUpdate.title" />
      </MemoryRouter>
    );
    expect(screen.getByText("mobileNumberUpdate.title")).toBeInTheDocument();
    fireEvent.click(screen.getByText("reKyc.home"));
    expect(navigateSpy).toHaveBeenCalledWith("/home");
  });
});
