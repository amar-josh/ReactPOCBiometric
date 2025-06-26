import { convertXML } from "simple-xml-to-json";

import { BIOMETRIC_SERVICE_AND_DEVICE_STATUS } from "@/constants/globalConstant";

declare global {
  interface Window {
    NativeCallback?: {
      sendRequest?: (serviceId: string) => Promise<any>;
    };
  }
}

const callFlutterMethod = async (serviceId: string) => {
  // Check if the communication bridge is ready
  if (
    window.NativeCallback &&
    typeof window.NativeCallback.sendRequest === "function"
  ) {
    try {
      const response = await window.NativeCallback.sendRequest(serviceId);
      return response;
    } catch (errorResponse: unknown) {
      return errorResponse;
    }
  } else {
    console.warn(
      "React App: NativeCallback is not available or not correctly injected."
    );
  }
};

export const getBiometricDeviceStatusInAndroid = async () => {
  try {
    const response = await callFlutterMethod("DEVICE_STATUS");
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    if (jsonData?.DeviceInfo?.dpId && jsonData?.DeviceInfo?.rdsId) {
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY;
    } else {
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY;
    }
  } catch (err) {
    return err;
  }
};

export const captureFingerPrintInAndroid = async () => {
  try {
    const response = await callFlutterMethod("CAPTURE_FINGERPRINT");
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    return jsonData;
  } catch (err) {
    return err;
  }
};
