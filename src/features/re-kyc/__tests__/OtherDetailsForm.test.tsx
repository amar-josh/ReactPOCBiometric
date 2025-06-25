import { render, screen } from "@testing-library/react";
import { Control, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import OtherDetailsForm from "../components/OtherDetailsForm";

// Mock Card and CommonFormComponent
vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
}));

vi.mock("@/components/common/Form", () => ({
  default: ({ field }: { field: { value: string } }) => (
    <div data-testid="form-field">{field.value}</div>
  ),
}));

// Mock form schema
vi.mock("../utils", async () => {
  const mod = await vi.importActual("../utils");
  return {
    ...mod,
    otherDetailsFormSchema: [
      { value: "field1", label: "Field 1", type: "text" },
      { value: "field2", label: "Field 2", type: "select" },
    ],
  };
});

interface IOtherDetailsFormValues {
  [key: string]: string | number;
}

const Wrapper = (
  props: Partial<{
    selectOptions: Record<string, { label: string; value: string | number }[]>;
    selectedOccupation: string;
  }>
) => {
  const { control } = useForm<IOtherDetailsFormValues>({
    defaultValues: {
      field1: "",
      field2: "",
    },
  });

  return (
    <OtherDetailsForm
      selectOptions={
        props.selectOptions ?? {
          field2: [{ label: "Option 1", value: 1 }],
        }
      }
      otherDetailsFormControl={control as Control<IOtherDetailsFormValues>}
    />
  );
};

describe("OtherDetailsForm", () => {
  it("renders correct number of form fields occupation, gross income and residenttype", () => {
    render(<Wrapper />);
    expect(screen.getAllByTestId("form-field")).toHaveLength(2);
  });

  it("renders the Card wrapper", () => {
    render(<Wrapper />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});
