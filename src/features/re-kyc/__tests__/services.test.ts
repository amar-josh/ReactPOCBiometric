import axios from "axios";
import { convertXML } from "simple-xml-to-json";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { biometricApiSuccess } from "@/features/re-kyc/mocks/biometricMocks";
import { fetchFakeData } from "@/lib/utils";

import mockReKYCData from "../mocks/reKYCDetails.json";
import {
  captureFingerPrint,
  getBiometricDeviceStatus,
  getCustomerDetailsService,
  getRDServiceStatus,
  updateKYC,
  validateFingerprint,
} from "../services";

vi.mock("axios");
vi.mock("simple-xml-to-json", () => ({
  convertXML: vi.fn(),
}));
vi.mock("@/lib/utils", () => ({
  fetchFakeData: vi.fn(),
}));

describe("Biometric Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRDServiceStatus", () => {
    it("should find RDService and return true", async () => {
      (axios as any).mockResolvedValue({
        data: "<RDService status='READY' info='IDEMIA_L1_RDSERVICE'/>",
      });
      (convertXML as any).mockReturnValue({
        RDService: { status: "READY", info: "IDEMIA_L1_RDSERVICE" },
      });

      const result = await getRDServiceStatus();
      expect(result).toBe(true);
    });

    it("should throw error if RDService not found", async () => {
      (axios as any).mockRejectedValue(new Error("Not found"));

      await expect(getRDServiceStatus()).rejects.toThrow(
        "RD Service not found"
      );
    });
  });

  describe("getBiometricDeviceStatus", () => {
    it("should throw error if device check fails", async () => {
      (axios as any).mockRejectedValue(new Error("Failed"));

      await expect(getBiometricDeviceStatus()).rejects.toThrow(
        "Device status check failed"
      );
    });
  });

  describe("captureFingerPrint", () => {
    it("should return data from fetchFakeData", async () => {
      const mockJson = { PidData: { resp: "OK" } };
      (axios as any).mockResolvedValue({ data: "<xml>" });
      (convertXML as any).mockReturnValue(mockJson);
      (fetchFakeData as any).mockResolvedValue(mockJson);

      const result = await captureFingerPrint();
      expect(result).toEqual(mockJson);
    });

    it("should return error if axios fails", async () => {
      const error = new Error("Failed");
      (axios as any).mockRejectedValue(error);

      const result = await captureFingerPrint();
      expect(result).toBe(error);
    });
  });

  describe("validateFingerprint", () => {
    it("should return biometricApiSuccess", async () => {
      (fetchFakeData as any).mockResolvedValue(biometricApiSuccess);
      const result = await validateFingerprint({} as any);
      expect(result).toEqual(biometricApiSuccess);
    });
  });

  describe("updateKYC", () => {
    it("should return addressUpdateFailure", async () => {
      (fetchFakeData as any).mockResolvedValue("FAILED");
      const result = await updateKYC({} as any);
      expect(result).toEqual("FAILED");
    });
  });

  describe("getCustomerDetailsService", () => {
    it("should return mocked ReKYC data", async () => {
      (fetchFakeData as any).mockResolvedValue(mockReKYCData);
      const result = await getCustomerDetailsService();
      expect(result).toEqual(mockReKYCData);
    });
  });
});
