import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EligibilityCard from "../EligibilityCard";

// Mock translator to just return the key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// Dummy Icon component
const DummyIcon = (props: any) => <svg {...props}></svg>;

describe("EligibilityCard", () => {
  const items = [
    { icon: "/icon1.png", alt: "icon1", text: "item1" },
    { icon: DummyIcon, alt: "icon2", text: "item2" },
  ];

  it("renders the title", () => {
    render(<EligibilityCard title="eligibility.title" items={items} />);

    expect(screen.getByText("eligibility.title")).toBeInTheDocument();
  });

  it("renders items with icons correctly", () => {
    render(<EligibilityCard title="eligibility.title" items={items} />);

    // Check text of both items
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();

    // Check image icon
    const imgIcon = screen.getByAltText("icon1") as HTMLImageElement;
    expect(imgIcon).toBeInTheDocument();
    expect(imgIcon.src).toContain("icon1.png");

    // Check component icon via aria-label
    const componentIcon = screen.getByLabelText("icon2");
    expect(componentIcon).toBeInTheDocument();
  });

  it("renders right-side image when provided", () => {
    render(
      <EligibilityCard
        title="eligibility.title"
        items={items}
        rightImage="/right.png"
        rightImageAlt="rightImg"
      />
    );

    const rightImg = screen.getByAltText("rightImg") as HTMLImageElement;
    expect(rightImg).toBeInTheDocument();
    expect(rightImg.src).toContain("right.png");
  });

  it("uses default alt for right image if not provided", () => {
    render(
      <EligibilityCard
        title="eligibility.title"
        items={items}
        rightImage="/right.png"
      />
    );

    const rightImg = screen.getByAltText("illustration") as HTMLImageElement;
    expect(rightImg).toBeInTheDocument();
  });
});
