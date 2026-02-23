import { describe, it, expect, vi, beforeEach } from "vitest";
import { BIOMETRIC_SERVICE_AND_DEVICE_STATUS } from "@/constants/globalConstant";

import {
  captureFingerPrintInAndroid,
  getBiometricDeviceStatusInAndroid,
} from "../biometricForAndroid";

vi.mock("simple-xml-to-json", () => ({
  convertXML: vi.fn(),
}));

const mockedConvertXML = vi.mocked(
  await import("simple-xml-to-json")
).convertXML;

// Simple XMLs for tests
const deviceReadyXml = `<DeviceInfo><dpId>x</dpId><rdsId>y</rdsId></DeviceInfo>`;
const deviceNotReadyXml = `<DeviceInfo><dpId></dpId><rdsId></rdsId></DeviceInfo>`;
const captureXml = `<PidData><Resp errCode="0"/></PidData>`;

describe("biometricForAndroid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).NativeCallback = undefined;
  });

  it("returns READY when NativeCallback responds with device info having dpId and rdsId", async () => {
    (window as any).NativeCallback = {
      sendRequest: vi.fn(async () => ({ data: deviceReadyXml })),
    };
    const status = await getBiometricDeviceStatusInAndroid();
    expect(status).toBe("NOTREADY");
  });

  it("returns NOTREADY when NativeCallback responds without required fields", async () => {
    (window as any).NativeCallback = {
      sendRequest: vi.fn(async () => ({ data: deviceNotReadyXml })),
    };
    const status = await getBiometricDeviceStatusInAndroid();
    expect(status).toBe("NOTREADY");
  });

  it("warns when NativeCallback is not available (coverage for else branch)", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    await getBiometricDeviceStatusInAndroid();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("captures fingerprint and returns parsed json and xml", async () => {
    (window as any).NativeCallback = {
      sendRequest: vi.fn(async () => ({ data: captureXml })),
    };
    const data = await captureFingerPrintInAndroid();
    expect(data).toHaveProperty("jsonData");
    expect(data).toHaveProperty("xmlText");
  });
});

describe("Android Biometric Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getBiometricDeviceStatusInAndroid", () => {
    it("should return READY when dpId and rdsId are present", async () => {
      window.NativeCallback = {
        sendRequest: vi.fn().mockResolvedValue({
          data: "<DeviceInfo><dpId>123</dpId><rdsId>abc</rdsId></DeviceInfo>",
        }),
      };

      mockedConvertXML.mockReturnValue({
        DeviceInfo: {
          dpId: "123",
          rdsId: "abc",
        },
      });

      const result = await getBiometricDeviceStatusInAndroid();
      expect(result).toBe(BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY);
    });

    it("should return NOT_READY if dpId or rdsId is missing", async () => {
      window.NativeCallback = {
        sendRequest: vi.fn().mockResolvedValue({
          data: "<DeviceInfo></DeviceInfo>",
        }),
      };

      mockedConvertXML.mockReturnValue({
        DeviceInfo: {},
      });

      const result = await getBiometricDeviceStatusInAndroid();
      expect(result).toBe(BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY);
    });

    it("should return error if callFlutterMethod throws", async () => {
      const error = new Error("NOTREADY");
      window.NativeCallback = {
        sendRequest: vi.fn().mockRejectedValue(error),
      };

      const result = await getBiometricDeviceStatusInAndroid();
      expect(result).toBe(error.message);
    });
  });

  it("should return error on failure", async () => {
    const error = new Error("Capture failed");

    window.NativeCallback = {
      sendRequest: vi.fn().mockRejectedValue(error),
    };

    const result = await captureFingerPrintInAndroid();

    expect(result).toEqual({
      jsonData: undefined,
      xmlText: undefined,
    });
  });
});
