import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock i18next before importing translator
vi.mock("i18next", () => ({
  t: vi.fn(),
}));

import { t } from "i18next";

import translator from "../translator";

describe("translator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the key when i18next.t is mocked as identity", () => {
    (t as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (k: string) => k
    );
    expect(translator("greeting")).toBe("greeting");
  });
});
