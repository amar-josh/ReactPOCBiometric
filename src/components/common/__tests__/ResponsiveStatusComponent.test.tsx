import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";

import ResponseStatusComponent, {
  IResponseStatusComponentProps,
} from "../ResponseStatusComponent";

// Mock translator to return key directly for simpler assertions
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("ResponseStatusComponent", () => {
  const backToHomeMock = vi.fn();

  const baseProps: IResponseStatusComponentProps = {
    status: "success",
    title: "Success Title",
    message: "Operation was successful",
    backToHome: backToHomeMock,
  };

  beforeEach(() => {
    backToHomeMock.mockClear();
  });

  it("renders error icon when status is 'failure'", () => {
    render(<ResponseStatusComponent {...baseProps} status="failure" />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", expect.stringContaining("error.svg"));
  });

  it("renders title and message", () => {
    render(<ResponseStatusComponent {...baseProps} />);
    expect(screen.getByText("Success Title")).toBeInTheDocument();
    expect(screen.getByText("Operation was successful")).toBeInTheDocument();
  });

  it("renders request number section when requestNumber prop is provided", () => {
    render(<ResponseStatusComponent {...baseProps} requestNumber="REQ12345" />);
    expect(
      screen.getByText("mobileNumberUpdate.requestNumber")
    ).toBeInTheDocument();
    expect(screen.getByText("REQ12345")).toBeInTheDocument();
  });

  it("renders old and new mobile numbers when both are provided", () => {
    render(
      <ResponseStatusComponent
        {...baseProps}
        oldMobileNumber="1234567890"
        newMobileNumber="0987654321"
      />
    );
    expect(
      screen.getByText("mobileNumberUpdate.oldMobileNumber")
    ).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();

    expect(
      screen.getByText("mobileNumberUpdate.newMobileNumber")
    ).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
  });

  it("calls backToHome when the button is clicked", () => {
    render(<ResponseStatusComponent {...baseProps} />);
    const button = screen.getByRole("button", { name: /Back to home/i });
    fireEvent.click(button);
    expect(backToHomeMock).toHaveBeenCalledTimes(1);
  });
});
