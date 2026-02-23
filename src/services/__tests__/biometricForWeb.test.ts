import { describe, it, expect, vi, beforeEach } from "vitest";
import { convertXML } from "simple-xml-to-json";
import axios from "axios";

import {
  BIOMETRIC_SERVICE_AND_DEVICE_STATUS,
  RD_SERVICE_NAME,
} from "@/constants/globalConstant";

import {
  getRDServiceStatus,
  getBiometricDeviceStatus,
  captureFingerPrint,
} from "../biometricForWeb";

vi.mock("axios");
vi.mock("simple-xml-to-json", () => ({
  convertXML: vi.fn(),
}));

const mockedAxios = axios as unknown as {
  mockRejectedValue: any;
  mockResolvedValue(arg0: { data: string }): unknown;
  (config: any): Promise<any>;
};

const mockedConvertXML = vi.mocked(convertXML);

describe("biometricForWeb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find RD service and return true", async () => {
    mockedAxios.mockResolvedValue({
      data: "<RDService status='READY' info='MockRD'/>",
    });
    mockedConvertXML.mockReturnValue({
      RDService: {
        status: BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY,
        info: RD_SERVICE_NAME,
      },
    });

    const result = await getRDServiceStatus();
    expect(result).toBe(true);
  });

  it("getRDServiceStatus scans ports and returns true when service found", async () => {
    // First few ports throw, then one resolves with expected data
    (mockedAxios as any)
      .mockImplementationOnce(() => Promise.reject())
      .mockImplementationOnce(() => Promise.reject())
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: `<RDService status="READY" info="IDEMIA_L1_RDSERVICE"/>`,
        })
      );
    const res = await getRDServiceStatus();
    expect(res).toBe(true);
  });

  it("getRDServiceStatus throws if no service found", async () => {
    (mockedAxios as any).mockImplementation(() => Promise.reject());
    await expect(getRDServiceStatus()).rejects.toThrow("RD Service not found");
  });

  it("getBiometricDeviceStatus returns READY/NOTREADY based on XML", async () => {
    (mockedAxios as any).mockResolvedValueOnce({
      data: `<DeviceInfo><dpId>x</dpId><rdsId>y</rdsId></DeviceInfo>`,
    });
    const ready = await getBiometricDeviceStatus();
    expect(ready).toBe("NOTREADY");

    (mockedAxios as any).mockResolvedValueOnce({
      data: `<DeviceInfo><dpId></dpId><rdsId></rdsId></DeviceInfo>`,
    });
    const notReady = await getBiometricDeviceStatus();
    expect(notReady).toBe("NOTREADY");
  });

  it("getBiometricDeviceStatus returns error on exception", async () => {
    (mockedAxios as any).mockRejectedValueOnce(new Error("fail"));
    const res = await getBiometricDeviceStatus();
    expect(res).toBeInstanceOf(Error);
  });

  it("captureFingerPrint returns parsed json and xml", async () => {
    (mockedAxios as any).mockResolvedValueOnce({
      data: `<PidData><Resp errCode="0"/></PidData>`,
    });
    const res = await captureFingerPrint();
    expect(res).toHaveProperty("jsonData");
    expect(res).toHaveProperty("xmlText");
  });

  it("captureFingerPrint returns error on exception", async () => {
    (mockedAxios as any).mockRejectedValueOnce(new Error("cap-fail"));
    const res = await captureFingerPrint();
    expect(res).toBeInstanceOf(Error);
  });
});

describe("getBiometricDeviceStatus", () => {
  it("should return READY if dpId and rdsId are present", async () => {
    mockedAxios.mockResolvedValue({
      data: "<DeviceInfo><dpId>123</dpId><rdsId>abc</rdsId></DeviceInfo>",
    });

    mockedConvertXML.mockReturnValue({
      DeviceInfo: {
        dpId: "123",
        rdsId: "abc",
      },
    });

    const result = await getBiometricDeviceStatus();
    expect(result).toBe(BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY);
  });

  it("should return NOT_READY if dpId or rdsId is missing", async () => {
    mockedAxios.mockResolvedValue({
      data: "<DeviceInfo></DeviceInfo>",
    });

    mockedConvertXML.mockReturnValue({
      DeviceInfo: {},
    });

    const result = await getBiometricDeviceStatus();
    expect(result).toBe(BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY);
  });

  it("should return error object if axios fails", async () => {
    const error = new Error("Device info fetch failed");
    mockedAxios.mockRejectedValue(error);

    const result = await getBiometricDeviceStatus();
    expect(result).toBe(error);
  });
});
