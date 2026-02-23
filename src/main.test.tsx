import { describe, expect, it, vi } from "vitest";

import { queryClient } from "./main";

vi.mock("react-dom/client", async () => {
  const actual: any = await vi.importActual("react-dom/client");
  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  };
});

vi.mock("./App", () => ({
  __esModule: true,
  default: () => <div>Mocked App</div>,
}));

describe("main.tsx", () => {
  it("should use the correct queryClient configuration", () => {
    expect(queryClient.getDefaultOptions()).toMatchObject({
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        refetchOnMount: false,
      },
    });
  });
});
