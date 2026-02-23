import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MASKED_KEY, NO, YES } from "@/constants/globalConstant";

import MobileEmailVerification from "..";
import { IDENTIFIER_TYPE_CONSTANTS } from "../constants";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

const searchDetailsMock = vi.fn();
const generateLinkMock = vi.fn();
const resetSearchDetailsMock = vi.fn();
const resetGenerateLinkMock = vi.fn();

let mockSearchDetailsReturn: any;
let mockGenerateLinkReturn: any;

vi.mock("../hooks", () => ({
  useSearchDetails: () => mockSearchDetailsReturn,
  useGenerateLink: () => mockGenerateLinkReturn,
}));

vi.mock("@/components/common/PageHeader", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock("@/components/common/AlertMessage", () => ({
  default: ({ type, message }: { type: string; message: string }) => (
    <div data-testid={`alert-${type}`}>{`${type}:${message}`}</div>
  ),
}));
vi.mock("@/components/common/TableComponent", () => ({
  default: ({ data }: any) => (
    <div data-testid="table-comp">{JSON.stringify(data)}</div>
  ),
}));

// UPDATED: Use MASKED_KEY to ensure the branch logic in onSubmit works
vi.mock("../components/VerificationForm", () => ({
  default: ({ onSubmit, onReset }: any) => (
    <div>
      <button
        onClick={() =>
          onSubmit({ identifier: MASKED_KEY.EMAIL, email: "a@b.com" })
        }
      >
        Submit Email
      </button>
      <button
        onClick={() =>
          onSubmit({
            identifier: MASKED_KEY.MOBILE_NUMBER,
            mobile: "1234567890",
          })
        }
      >
        Submit Mobile
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  ),
}));

describe("MobileEmailVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchDetailsReturn = {
      mutate: searchDetailsMock,
      isPending: false,
      isSuccess: false,
      data: null,
      reset: resetSearchDetailsMock,
    };
    mockGenerateLinkReturn = {
      mutate: generateLinkMock,
      isPending: false,
      isSuccess: false,
      reset: resetGenerateLinkMock,
    };
  });

  it("shows FullScreenLoader when search details or generate link is pending", () => {
    mockSearchDetailsReturn.isPending = true;
    render(<MobileEmailVerification />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("calls searchDetails mutate with correct email payload", async () => {
    render(<MobileEmailVerification />);
    fireEvent.click(screen.getByText("Submit Email"));
    // This will now pass because the mock uses MASKED_KEY.EMAIL
    expect(searchDetailsMock).toHaveBeenCalledWith({ email: "a@b.com" });
  });

  it("calls searchDetails mutate with correct mobile payload", async () => {
    render(<MobileEmailVerification />);
    fireEvent.click(screen.getByText("Submit Mobile"));
    expect(searchDetailsMock).toHaveBeenCalledWith({ mobile: "1234567890" });
  });

  it("calls reset hooks when reset button is clicked", () => {
    render(<MobileEmailVerification />);
    fireEvent.click(screen.getByText("Reset"));
    expect(resetSearchDetailsMock).toHaveBeenCalled();
    expect(resetGenerateLinkMock).toHaveBeenCalled();
  });

  it("renders table data correctly with YES/NO constants", () => {
    mockSearchDetailsReturn = {
      ...mockSearchDetailsReturn,
      isSuccess: true,
      data: {
        data: {
          mobile: "1234567890",
          verificationStatus: true,
          lastVerificationPerformed: "2024-01-01",
        },
      },
    };

    render(<MobileEmailVerification />);
    const tableComp = screen.getByTestId("table-comp");
    expect(tableComp.textContent).toContain("1234567890");
    expect(tableComp.textContent).toContain(YES);
  });

  it("handles the Submit (Verify) click with Mobile payload", async () => {
    mockSearchDetailsReturn = {
      ...mockSearchDetailsReturn,
      isSuccess: true,
      data: {
        data: {
          mobile: "9988776655",
          requestNumber: "REQ123",
          verificationStatus: false,
          reVerify: false,
        },
      },
    };

    render(<MobileEmailVerification />);
    const verifyBtn = screen.getByText("verify");
    fireEvent.click(verifyBtn);

    expect(generateLinkMock).toHaveBeenCalledWith({
      identifier: IDENTIFIER_TYPE_CONSTANTS.MOBILE,
      mobileNumber: "9988776655",
      requestNumber: "REQ123",
    });
  });

  it("handles the Submit (Verify) click with Email payload", async () => {
    mockSearchDetailsReturn = {
      ...mockSearchDetailsReturn,
      isSuccess: true,
      data: {
        data: {
          email: "test@test.com",
          requestNumber: "REQ456",
          verificationStatus: false,
          reVerify: false,
        },
      },
    };

    render(<MobileEmailVerification />);
    const verifyBtn = screen.getByText("verify");
    fireEvent.click(verifyBtn);

    expect(generateLinkMock).toHaveBeenCalledWith({
      identifier: IDENTIFIER_TYPE_CONSTANTS.EMAIL,
      email: "test@test.com",
      requestNumber: "REQ456",
    });
  });

  it("enables Re-verify button and shows warning alert when reVerify logic triggers", () => {
    mockSearchDetailsReturn = {
      ...mockSearchDetailsReturn,
      isSuccess: true,
      data: {
        data: {
          email: "old@verified.com",
          reVerify: true,
          verificationStatus: true,
        },
      },
    };

    render(<MobileEmailVerification />);

    expect(screen.getByTestId("alert-warning")).toBeInTheDocument();
    expect(screen.getByText("verify")).toBeDisabled();

    const reVerifyBtn = screen.getByText("button.reVerify");
    expect(reVerifyBtn).not.toBeDisabled();

    fireEvent.click(reVerifyBtn);
    expect(generateLinkMock).toHaveBeenCalled();
  });

  it("shows success alert when link generation is successful", () => {
    mockGenerateLinkReturn.isSuccess = true;
    render(<MobileEmailVerification />);
    expect(screen.getByTestId("alert-success")).toBeInTheDocument();
    expect(
      screen.getByText(
        "success:mobileEmailVerification.mobileLinkSentToCustomer"
      )
    ).toBeInTheDocument();
  });

  it("covers NO status branch in table data", () => {
    mockSearchDetailsReturn = {
      ...mockSearchDetailsReturn,
      isSuccess: true,
      data: {
        data: {
          email: "notverified@test.com",
          verificationStatus: false,
        },
      },
    };
    render(<MobileEmailVerification />);
    const tableComp = screen.getByTestId("table-comp");
    expect(tableComp.textContent).toContain(NO);
  });
});
