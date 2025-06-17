import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

// Mock RoutesComponent so we don't test routing itself
vi.mock("./routes/RoutesComponent", () => ({
  default: () => <div data-testid="routes-component">Mocked Routes</div>,
}));

// Create a new query client for each test
const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  });

describe("App Component", () => {
  const renderWithProviders = () =>
    render(
      <QueryClientProvider client={createTestClient()}>
        <App />
      </QueryClientProvider>
    );

  it("renders the RoutesComponent", () => {
    const { getByTestId } = renderWithProviders();
    expect(getByTestId("routes-component")).toBeInTheDocument();
  });

  it("prevents right-click (contextmenu)", () => {
    renderWithProviders();

    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });

    const preventDefault = vi.fn();
    Object.defineProperty(event, "preventDefault", {
      value: preventDefault,
      writable: true,
    });

    document.dispatchEvent(event);
    expect(preventDefault).toHaveBeenCalled();
  });

  it("blocks dev tool shortcuts", () => {
    renderWithProviders();

    const keysToBlock = [
      { key: "F12" },
      { key: "I", ctrlKey: true, shiftKey: true },
      { key: "C", ctrlKey: true, shiftKey: true },
      { key: "J", ctrlKey: true, shiftKey: true },
      { key: "U", ctrlKey: true },
      { key: "R", ctrlKey: true },
      { key: "R", ctrlKey: true, shiftKey: true },
    ];

    for (const keyEvent of keysToBlock) {
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
    }
  });

  it("does not block unrelated keys", () => {
    renderWithProviders();

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
