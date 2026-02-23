import axios from "axios";
import { convertXML } from "simple-xml-to-json";

import {
  BIOMETRIC_SERVICE_AND_DEVICE_STATUS,
  CAPTURE_FINGERPRINT_REQUEST_BODY,
  RD_SERVICE_NAME,
  RD_SERVICE_PORTS,
  RD_SERVICE_TIMEOUT_MS,
} from "@/constants/globalConstant";

let activeRDPort: number | null = null;

// Find RD service which running between port 11100 to 11120
export const getRDServiceStatus = async () => {
  for (
    let port = RD_SERVICE_PORTS.START;
    port <= RD_SERVICE_PORTS.END;
    port++
  ) {
    try {
      const response = await axios({
        url: `https://localhost:${port}`,
        method: "RDSERVICE",
        timeout: RD_SERVICE_TIMEOUT_MS,
      });

      const xmlText = response.data;
      const jsonData = convertXML(xmlText);

      const status = jsonData?.RDService?.status;
      const info = jsonData?.RDService?.info;

      if (
        (status === BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY ||
          status === BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY) &&
        info === RD_SERVICE_NAME
      ) {
        activeRDPort = port; // Set the active RD port
        return true; // RD Service found
      }
    } catch {
      // Continue to next port
      console.log(`RD Service not found on port ${port}. Trying next...`);
    }
  }
  throw new Error("RD Service not found");
};

export const getBiometricDeviceStatus = async () => {
  try {
    const response = await axios({
      url: `https://localhost:${activeRDPort}/getDeviceInfo`,
      method: "DEVICEINFO",
    });
    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    if (jsonData?.DeviceInfo?.dpId && jsonData?.DeviceInfo?.rdsId) {
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.READY;
    } else {
      return BIOMETRIC_SERVICE_AND_DEVICE_STATUS.NOT_READY;
    }
  } catch (error) {
    return error;
  }
};

export const captureFingerPrint = async (): Promise<any> => {
  try {
    const response = await axios({
      url: `https://localhost:${activeRDPort}/capture`,
      method: "capture",
      data: CAPTURE_FINGERPRINT_REQUEST_BODY,
    });

    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    return { jsonData, xmlText };
  } catch (error) {
    return error;
  }
};
