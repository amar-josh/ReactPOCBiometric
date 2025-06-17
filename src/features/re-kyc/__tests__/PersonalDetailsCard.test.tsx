import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PersonalDetailsCard from "../components/PersonalDetailsCard";

// Mock the translator to return the key passed
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// Mock the CardWrapper component
vi.mock("@/components/common/InfoCardWrapper", () => ({
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
    backgroundColor: string;
  }) => (
    <div data-testid="card-wrapper">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

describe("PersonalDetailsCard", () => {
  const props = {
    name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  it("renders the CardWrapper with translated title", () => {
    render(<PersonalDetailsCard {...props} />);
    expect(screen.getByText("reKyc.personalDetails")).toBeInTheDocument();
  });

  it("renders the user's name", () => {
    render(<PersonalDetailsCard {...props} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders the email with label", () => {
    render(<PersonalDetailsCard {...props} />);
    expect(screen.getByText("reKyc.email:")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders the masked mobile number with label", () => {
    render(<PersonalDetailsCard {...props} />);
    expect(screen.getByText("reKyc.mobileNumber:")).toBeInTheDocument();
    expect(screen.getByText("XXXXXX3210")).toBeInTheDocument();
  });

  it("renders the avatar image with correct src and alt", () => {
    render(<PersonalDetailsCard {...props} />);
    const avatar = screen.getByAltText("avatar") as HTMLImageElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toBe(props.avatarUrl);
  });
});
