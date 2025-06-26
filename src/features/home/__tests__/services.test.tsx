import { describe, expect, it, vi } from "vitest";

import { ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import homeCardsMockData from "../mocks/HomeCards.json";
import * as services from "../services";

// 🔁 Mock POST function
vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

const mockPost = POST as unknown as ReturnType<typeof vi.fn>;

describe("home services", () => {
  it("getInstaServices", async () => {
    const payload = {
      userId: "USR00123",
      userRole: "maker",
    };
    mockPost.mockResolvedValueOnce(homeCardsMockData);
    const response = await services.getInstaServices(payload);
    expect(mockPost).toHaveBeenCalledWith(
      ENDPOINTS.GET_INSTA_SERVICES,
      payload
    );
    expect(response).toEqual(homeCardsMockData);
  });
});
