import "@testing-library/jest-dom";

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
    VITE_BASE_URL: "/base",
  },
  configurable: true,
});
