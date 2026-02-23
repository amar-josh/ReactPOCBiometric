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
    console.log("Checking biometric device status in Android...");
    const response = await callFlutterMethod("DEVICE_STATUS");
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    console.log("Biometric device status response:", jsonData);
    alert("Biometric device status response: " + JSON.stringify(jsonData));
    if (jsonData?.DeviceInfo?.dpId && jsonData?.DeviceInfo?.rdsId) {
      console.log("Biometric device is ready.");
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY;
    } else {
      console.log("Biometric device is not ready.");
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY;
    }
  } catch (err) {
    console.error("Error checking biometric device status in Android:", err);
    alert("Error checking biometric device status in Android: " + JSON.stringify(err));
    return err;
  }
};

export const captureFingerPrintInAndroid = async (): Promise<any> => {
  try {
    const response = await callFlutterMethod("CAPTURE_FINGERPRINT");
    console.log("Fingerprint capture response from Android:", response);
    alert("Fingerprint capture response from Android: " + JSON.stringify(response));
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    console.log("Parsed fingerprint capture response:", jsonData);
    alert("Parsed fingerprint capture response: " + JSON.stringify(jsonData));
    return { jsonData, xmlText };
  } catch (err) {
    console.error("Error capturing fingerprint in Android:", err);
    alert("Error capturing fingerprint in Android: " + JSON.stringify(err));
    return err;
  }
};
