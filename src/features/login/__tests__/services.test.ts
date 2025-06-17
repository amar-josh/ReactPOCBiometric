import { beforeEach, describe, expect, it, vi } from "vitest";

import { axiosInstance } from "@/services/api.service";

import { clearTokens } from "../services";

vi.mock("@/services/api.service", () => ({
  axiosInstance: {
    defaults: {
      headers: {
        common: {
          Authorization: "Bearer something",
        },
      },
    },
  },
}));

describe("clearTokens", () => {
  beforeEach(() => {
    localStorage.setItem("appToken", "test-token");
    axiosInstance.defaults.headers.common.Authorization = "Bearer something";
  });

  it("removes appToken from localStorage", () => {
    clearTokens();
    expect(localStorage.getItem("appToken")).toBeNull();
  });

  it("clears axiosInstance Authorization header", () => {
    clearTokens();
    expect(axiosInstance.defaults.headers.common.Authorization).toBe("");
  });
});
