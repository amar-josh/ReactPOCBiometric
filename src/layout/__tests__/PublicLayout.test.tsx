import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import PublicLayout from "../PublicLayout";

vi.mock("../../components/common/Header", () => ({
  default: () => <div>Mock Header</div>,
}));

vi.mock("../../components/common/Footer", () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className}>Mock Footer</div>
  ),
}));

describe("PublicLayout", () => {
  it("renders Header, Footer and Outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<div>Public Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Mock Header")).toBeInTheDocument();
    expect(screen.getByText("Public Page Content")).toBeInTheDocument();
    expect(screen.getByText("Mock Footer")).toBeInTheDocument();
  });
});
