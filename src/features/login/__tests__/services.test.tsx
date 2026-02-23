import { describe, expect, it, vi } from "vitest";

import { ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import { loginService } from "../services";
import type { ILoginRequest } from "../types";

vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

describe("loginService", () => {
  it("should call POST with correct endpoint and payload", async () => {
    const payload: ILoginRequest = { username: "test", password: "1234" };
    const mockResponse = { token: "fake-token" };
    vi.mocked(POST).mockResolvedValue(mockResponse as any);

    const result = await loginService(payload);

    expect(POST).toHaveBeenCalledWith(ENDPOINTS.LOGIN, payload);
    expect(result).toEqual(mockResponse);
  });

  it("should throw error if POST fails", async () => {
    const payload: ILoginRequest = { username: "test", password: "1234" };
    const error = new Error("Network Error");

    vi.mocked(POST).mockRejectedValue(error);

    await expect(loginService(payload)).rejects.toThrow("Network Error");
  });
});
