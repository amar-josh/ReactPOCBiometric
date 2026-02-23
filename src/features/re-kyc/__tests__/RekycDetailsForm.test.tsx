import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import ReKYCDetailsForm from "../components/reKYCDetailsForm";

// Mock translator to return the key itself
vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

// Mock schema used to render form fields
vi.mock("../utils", () => ({
  reKycFormSchema: [
    { label: "Full Name", value: "fullName", type: "text" },
    { label: "Mobile Number", value: "mobileNo", type: "text" },
    { label: "Email ID", value: "emailId", type: "email" },
  ],
}));

// Mock CommonFormComponent to just render the label
vi.mock("@/components/common/Form", () => ({
  __esModule: true,
  default: ({ field }: any) => (
    <div data-testid="form-field">{field.label}</div>
  ),
}));

// Wrapper component to allow `useForm` inside valid React context
function TestWrapper() {
  const methods = useForm();
  return <ReKYCDetailsForm reKYCDetailsFormControl={methods.control} />;
}

describe("ReKYCDetailsForm", () => {
  it("should render form section title", () => {
    render(<TestWrapper />);
    expect(screen.getByText("reKyc.reKycDetails")).toBeInTheDocument();
  });

  it("should render all fields from reKycFormSchema", () => {
    render(<TestWrapper />);
    const fields = screen.getAllByTestId("form-field");
    expect(fields).toHaveLength(3);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByText("Email ID")).toBeInTheDocument();
  });
});
