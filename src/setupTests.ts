import "@testing-library/jest-dom";

import React, { type FC } from "react";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;

import { vi } from "vitest";

// --- Axios Mock (global) ---
let mockHeaders: Record<string, any>;
let mockAxiosInstance: any;

vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

vi.mock("lottie-react", () => {
  const MockLottie: FC = () => {
    return React.createElement("div", { "data-testid": "LottieMock" });
  };
  return { default: MockLottie };
});

vi.mock("axios", () => {
  mockHeaders = {};
  mockAxiosInstance = {
    defaults: {
      headers: {
        common: mockHeaders,
      },
    },
    post: vi.fn(),
  };
  return {
    __esModule: true,
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
  };
});

// --- Global environment mock (optional, for all tests) ---
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_URL: "http://mock-api",
  },
  configurable: true,
});

Object.defineProperty(window, "crypto", {
  value: {
    subtle: {
      importKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
    },
    getRandomValues: (arr: Uint8Array) => crypto.getRandomValues(arr),
  },
});
