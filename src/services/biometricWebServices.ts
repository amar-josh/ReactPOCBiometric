import axios from "axios";
import { convertXML } from "simple-xml-to-json";

import { fetchFakeData } from "@/lib/utils";

// Biometric Service
let activeRDPort: number | null = null;

export const getRDServiceStatus = async () => {
  // Find RD service port
  for (let port = 11100; port <= 11120; port++) {
    try {
      const response = await axios({
        url: `https://localhost:${port}/`,
        method: "RDSERVICE",
        timeout: 3000,
      });

      const xmlText = response.data;
      const jsonData = convertXML(xmlText);

      const status = jsonData?.RDService?.status;
      const info = jsonData?.RDService?.info;

      if (
        (status === "READY" || status === "NOTREADY") &&
        info === "IDEMIA_L1_RDSERVICE"
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
    // TODO: Uncomment this in deployment time and remove the fetchFakeData
    if (jsonData?.DeviceInfo?.dpId && jsonData?.DeviceInfo?.rdsId) {
      return "READY";
    } else {
      return "NOTREADY";
    }
    // return fetchFakeData("READY");
  } catch (err) {
    console.log("Device not ready:", err);
    throw new Error("Device status check failed");
  }
};

export const captureFingerPrint = async () => {
  const xmlBody = `<PidOptions ver="1.0"><Opts env="PP" fCount="1" fType="0" iCount="" iType="" pCount="" pType="" format="0" pidVer="2.0" timeout="120000" otp="" wadh="" posh=""/></PidOptions>`;

  try {
    const response = await axios({
      url: `https://localhost:${activeRDPort}/capture`,
      method: "capture", // Custom method used by RD Service
      data: xmlBody,
    });

    const xmlText = response.data;
    const jsonData = convertXML(xmlText);
    return jsonData; // TODO: Uncomment this in deployment time and remove the fetchFakeData

    // return fetchFakeData(jsonData);
  } catch (error) {
    console.error("Error while capturing fingerprint:", error);
    return error;
  }
};
