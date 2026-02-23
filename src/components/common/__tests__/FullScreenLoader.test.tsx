import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FullScreenLoader from "../FullScreenLoader";

vi.mock("lottie-react", () => ({
  default: (props: any) => (
    <div data-testid="LottieMock" style={props.style}>
      Lottie Animation
    </div>
  ),
}));

vi.mock("@/assets/splash-loader.json", () => ({
  default: {},
}));

describe("FullScreenLoader", () => {
  it("renders the loader container and the lottie component", () => {
    render(<FullScreenLoader />);

    const lottieElement = screen.getByTestId("LottieMock");
    expect(lottieElement).toBeInTheDocument();
  });

  it("applies full-screen fixed positioning and z-index to the container", () => {
    const { container } = render(<FullScreenLoader />);
    const outerDiv = container.firstChild as HTMLElement;

    // Verify critical styles for a Full Screen Loader
    expect(outerDiv).toHaveStyle({
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      zIndex: "9999",
      display: "flex",
    });
  });

  it("applies the correct dimensions to the Lottie animation", () => {
    render(<FullScreenLoader />);
    const lottieElement = screen.getByTestId("LottieMock");

    // Verify the specific size defined in lottieStyle
    expect(lottieElement).toHaveStyle({
      width: "164px",
      height: "164px",
    });
  });

  it("renders with a semi-transparent background overlay", () => {
    const { container } = render(<FullScreenLoader />);
    const outerDiv = container.firstChild as HTMLElement;

    expect(outerDiv).toHaveStyle({
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    });
  });
});
