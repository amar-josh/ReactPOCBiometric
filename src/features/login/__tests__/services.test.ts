import { afterEach, describe, expect, it, vi } from "vitest";

import { ENDPOINTS } from "@/constants/endPoints";

import { generateToken, logout } from "../services";

// Mock POST from api.service
vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

describe("login/services", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("generateToken", () => {
    it("calls POST with correct endpoint and returns response", async () => {
      const mockResponse = { token: "abc123" };
      const { POST } = await import("@/services/api.service");
      (POST as any).mockResolvedValueOnce(mockResponse);

      const result = await generateToken();
      expect(POST).toHaveBeenCalledWith(ENDPOINTS.GENERATE_TOKEN);
      expect(result).toBe(mockResponse);
    });

    it("throws if POST rejects", async () => {
      const { POST } = await import("@/services/api.service");
      (POST as any).mockRejectedValueOnce(new Error("fail"));

      await expect(generateToken()).rejects.toThrow("fail");
    });
  });

  describe("logout", () => {
    it("is a function (placeholder until implemented)", () => {
      expect(typeof logout).toBe("function");
    });
  });
});
