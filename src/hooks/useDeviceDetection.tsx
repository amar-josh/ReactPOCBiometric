import { useEffect, useState } from "react";

import { getDeviceType } from "@/lib/getDeviceType";

export const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState("desktop");
  useEffect(() => {
    setDeviceType(getDeviceType());
  }, []);
  const isAndroidWebView = deviceType === "android_webview";
  return {
    isAndroidWebView,
  };
};
