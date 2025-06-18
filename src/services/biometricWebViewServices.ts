import { convertXML } from "simple-xml-to-json";

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

export const getBiometricDeviceStatusInWebView = async () => {
  try {
    const response = await callFlutterMethod("DEVICE_STATUS");
    console.log("response", response);
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    alert(
      `device status ${JSON.stringify(jsonData?.DeviceInfo?.dpId)} ${JSON.stringify(jsonData?.DeviceInfo?.rdsId)}`
    );
    if (jsonData?.DeviceInfo?.dpId && jsonData?.DeviceInfo?.rdsId) {
      return "READY";
    } else {
      return "NOTREADY";
    }
  } catch (err) {
    return err;
  }
};

export const captureFingerPrintInWebView = async () => {
  try {
    const response = await callFlutterMethod("CAPTURE_FINGERPRINT");
    console.log("response", response);

    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    // alert(`FingerPrintcapture ${JSON.stringify(jsonData)}`);
    return jsonData;
  } catch (err) {
    return err;
  }
};
