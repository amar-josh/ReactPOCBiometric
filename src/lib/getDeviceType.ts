export const getDeviceType = () => {
  const ua = navigator.userAgent;

  // Check for Android specifically
  if (/Android/i.test(ua)) {
    // Check if it's an Android WebView (often contains 'wv' or 'WebView')
    // Note: 'wv' is very common for system WebViews used by apps
    if (/wv|WebView/.test(ua)) {
      return "android_webview";
    }
    return "android_device"; // Generic Android browser
  }

  // Check for iOS (iPhone/iPad) - useful to distinguish from Android future purpose
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return "ios_device";
  }

  // Check for common desktop OSes
  if (
    /Windows/i.test(ua) ||
    /Macintosh|Mac OS X/i.test(ua) ||
    (/Linux/i.test(ua) && !/Android/i.test(ua))
  ) {
    return "desktop";
  }

  // Fallback for unknown or other types
  return "unknown";
};
