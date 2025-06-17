import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Stepper from "../Stepper";

// Mock translator to just return the input string key for easy assertions
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("Stepper", () => {
  const steps = ["step.one", "step.two", "step.three"];

  it("renders all steps with step numbers and translated labels", () => {
    render(<Stepper steps={steps} currentStep={1} completed={{}} />);

    steps.forEach((label, i) => {
      const stepNum = i + 1;
      expect(screen.getByText(`${stepNum}.`)).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("does not render an icon if step is neither active nor completed", () => {
    render(<Stepper steps={steps} currentStep={1} completed={{}} />);
    const step2 = screen.getByText("2.").parentElement;
    expect(step2?.querySelector("img")).toBeNull();
  });
});
