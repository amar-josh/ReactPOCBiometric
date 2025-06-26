import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";

// Optional: mock RoutesComponent if it renders complex stuff
vi.mock("./routes/RoutesComponent", () => ({
  default: () => <div data-testid="routes-component">Mocked Routes</div>,
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders RoutesComponent", () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId("routes-component")).toBeInTheDocument();
  });

  it("prevents context menu (right-click)", () => {
    render(<App />);
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });

    const preventDefault = vi.fn();
    event.preventDefault = preventDefault;

    document.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
  });

  it("blocks developer tool keys (F12, Ctrl+Shift+I, Ctrl+U, etc)", () => {
    render(<App />);

    const keysToTest = [
      { key: "F12" },
      { key: "I", ctrlKey: true, shiftKey: true },
      { key: "C", ctrlKey: true, shiftKey: true },
      { key: "J", ctrlKey: true, shiftKey: true },
      { key: "U", ctrlKey: true },
      { key: "R", ctrlKey: true, shiftKey: true },
    ];

    keysToTest.forEach((keyEvent) => {
      const event = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        ...keyEvent,
      });

      const preventDefault = vi.fn();
      Object.defineProperty(event, "preventDefault", {
        value: preventDefault,
        writable: true,
      });

      document.dispatchEvent(event);
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  it("does not block unrelated keys", () => {
    render(<App />);

    const event = new KeyboardEvent("keydown", {
      key: "A",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefault = vi.fn();
    Object.defineProperty(event, "preventDefault", {
      value: preventDefault,
      writable: true,
    });

    document.dispatchEvent(event);
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
