import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LoginComponent from "../components/LoginPage";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("i18next", () => ({
  t: (key: string) => key,
}));

describe("LoginComponent", () => {
  const mockSetShowModal = vi.fn();
  const mockHandleSubmit = (fn: () => void) => (e: React.FormEvent) => {
    e.preventDefault();
    fn();
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo, heading, and email input", () => {
    render(
      <LoginComponent
        showModal={false}
        setShowModal={mockSetShowModal}
        errors={{}}
        register={() => ({
          name: "email",
          onChange: () => {},
          onBlur: () => {},
          ref: () => {},
        })}
        alertMessage={{ message: "", type: "info" }}
        handleSubmit={mockHandleSubmit}
        onSubmit={vi.fn()}
        handleNextClick={vi.fn()}
      />
    );

    expect(screen.getByAltText("Bandhan Bank")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "login.bbInstaServices"
    );
    expect(
      screen.getByPlaceholderText("Enter your official/work email ID")
    ).toBeInTheDocument();
  });

  it("calls setShowModal when link is clicked", () => {
    render(
      <LoginComponent
        showModal={false}
        setShowModal={mockSetShowModal}
        errors={{}}
        register={() => ({
          name: "email",
          onChange: () => {},
          onBlur: () => {},
          ref: () => {},
        })}
        alertMessage={{ message: "", type: "info" }}
        handleSubmit={mockHandleSubmit}
        onSubmit={vi.fn()}
        handleNextClick={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("login.cantAccessYourAccount ?"));
    expect(mockSetShowModal).toHaveBeenCalledWith(true);
  });

  it("calls handleNextClick on button click", () => {
    const mockNext = vi.fn();

    render(
      <LoginComponent
        showModal={false}
        setShowModal={mockSetShowModal}
        errors={{}}
        register={() => ({
          name: "email",
          onChange: () => {},
          onBlur: () => {},
          ref: () => {},
        })}
        alertMessage={{ message: "", type: "info" }}
        handleSubmit={mockHandleSubmit}
        onSubmit={vi.fn()}
        handleNextClick={mockNext}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "button.next" }));
    expect(mockNext).toHaveBeenCalled();
  });
});
