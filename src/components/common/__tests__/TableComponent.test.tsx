import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import translator from "@/i18n/translator";

import TableComponent from "../TableComponent"; // adjust path if needed

// 🔹 Mock the translator
vi.mock("@/i18n/translator", () => ({
  default: vi.fn((key: string) => `translated(${key})`),
}));

describe("TableComponent", () => {
  const headers = [
    { label: "name", key: "name" },
    { label: "email", key: "email" },
  ];

  it("renders table headers with translated labels", () => {
    render(<TableComponent headers={headers} data={[]} />);

    // Ensure translator is called with each header label
    expect(translator).toHaveBeenCalledWith("name");
    expect(translator).toHaveBeenCalledWith("email");

    // Check rendered text
    expect(screen.getByText("translated(name)")).toBeInTheDocument();
    expect(screen.getByText("translated(email)")).toBeInTheDocument();
  });

  it("renders table rows with data", () => {
    const data = [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
    ];

    render(<TableComponent headers={headers} data={data} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders '-' when data field is missing", () => {
    const data = [{ name: "John Doe" }]; // email is missing

    render(<TableComponent headers={headers} data={data} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders 'noRecordsFound' when data is empty", () => {
    render(<TableComponent headers={headers} data={[]} />);

    expect(translator).toHaveBeenCalledWith("noRecordsFound");
    expect(screen.getByText("translated(noRecordsFound)")).toBeInTheDocument();
  });
});
