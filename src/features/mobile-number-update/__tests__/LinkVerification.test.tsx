import { render, screen } from "@testing-library/react";
import { useSearchParams } from "react-router";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import LinkVerification from "../components/LinkVerification";
import { useVerifyLink } from "../hooks";

// Mocks
vi.mock("react-router", () => ({
  useSearchParams: vi.fn(),
}));

vi.mock("../hooks", () => ({
  useVerifyLink: vi.fn(),
}));

vi.mock("@/i18n/translator", () => ({
  default: vi.fn((key: string) => key),
}));

const mockMutate = vi.fn();

describe("LinkVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls linkVerificationMutation with token on mount", () => {
    (useSearchParams as unknown as Mock).mockReturnValue([
      new URLSearchParams("token=xyz"),
    ]);

    (useVerifyLink as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      data: null,
      isPending: false,
      error: null,
    });

    render(<LinkVerification />);
    expect(mockMutate).toHaveBeenCalledWith({ shortCode: "xyz" });
  });

  it("renders success UI when statusCode is 200", () => {
    (useSearchParams as unknown as Mock).mockReturnValue([
      new URLSearchParams("token=abc123"),
    ]);

    (useVerifyLink as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      data: {
        statusCode: 200,
        msg: "Link verified successfully",
      },
      error: null,
    });

    render(<LinkVerification />);
    expect(screen.getByText("mobileNumberUpdate.thankYou")).toBeInTheDocument();
    expect(screen.getByText("Link verified successfully")).toBeInTheDocument();
  });

  it("renders error UI when verification fails", () => {
    (useSearchParams as unknown as Mock).mockReturnValue([
      new URLSearchParams("token=invalid"),
    ]);

    (useVerifyLink as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      data: null,
      error: { message: "Invalid or expired token" },
    });

    render(<LinkVerification />);
    expect(screen.getByText("mobileNumberUpdate.sorry")).toBeInTheDocument();
    expect(screen.getByText("Invalid or expired token")).toBeInTheDocument();
  });

  it("treats 401 as success and shows proper message", () => {
    (useSearchParams as unknown as Mock).mockReturnValue([
      new URLSearchParams("token=abc"),
    ]);

    (useVerifyLink as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      data: {
        statusCode: 401,
        msg: "Token already used",
      },
      error: null,
    });

    render(<LinkVerification />);
    expect(screen.getByText("mobileNumberUpdate.thankYou")).toBeInTheDocument();
    expect(screen.getByText("Token already used")).toBeInTheDocument();
  });
});
