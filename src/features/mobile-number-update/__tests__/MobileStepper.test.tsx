import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MobileNumberStepper from "../components/MobileStepper";

// Mock translator to just return the key for predictable output
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("MobileNumberStepper", () => {
  const steps = ["step.one", "step.two", "step.three"];

  it("renders current step's translated name on the left side", () => {
    render(
      <MobileNumberStepper steps={steps} currentStep={2} completed={{}} />
    );
    const allLabels = screen.getAllByText("step.two");
    // The left side label is usually the first occurrence or you can add logic to find the right one
    expect(allLabels[0]).toBeInTheDocument();
  });

  it("renders the connecting lines with correct colors based on completion", () => {
    const { container } = render(
      <MobileNumberStepper
        steps={steps}
        currentStep={2}
        completed={{ 1: true, 2: false }}
      />
    );

    // Lines are divs with height 0.5 and absolute positioning
    const lines = container.querySelectorAll(
      "div.absolute.top-3.left-1\\/2.h-0\\.5"
    );
    // There should be steps.length - 1 lines
    expect(lines.length).toBe(steps.length - 1);

    // First line (between step 1 and 2) should be green (because step 1 completed)
    expect(lines[0]).toHaveClass("bg-green-100");
    // Second line (between step 2 and 3) should be gray (step 2 not completed)
    expect(lines[1]).toHaveClass("bg-gray-100");
  });
});
