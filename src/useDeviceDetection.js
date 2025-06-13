// hooks/useDeviceDetection.js
import { useState, useEffect } from 'react';

const getDeviceType = () => {
  const ua = navigator.userAgent;

  // 1. Check for Android specifically
  if (/Android/i.test(ua)) {
    // Check if it's an Android WebView (often contains 'wv' or 'WebView')
    // Note: 'wv' is very common for system WebViews used by apps
    if (/wv|WebView/.test(ua)) {
      return 'android_webview';
    }
    return 'android_device'; // Generic Android browser
  }

  // 2. Check for iOS (iPhone/iPad) - useful to distinguish from Android
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'ios_device';
  }

  // 3. Check for common desktop OSes
  if (/Windows/i.test(ua) || /Macintosh|Mac OS X/i.test(ua) || /Linux/i.test(ua) && !/Android/i.test(ua)) {
    return 'desktop';
  }

  // Fallback for unknown or other types
  return 'unknown';
};

const useDeviceDetection = () => {
  const [deviceType, setDeviceType] = useState('loading'); // Initial state

  useEffect(() => {
    // Set the device type once on component mount
    setDeviceType(getDeviceType());

    // Optional: Add listeners for window resize if you want to react to orientation changes
    // or if you want to re-evaluate on very rare cases where UA might dynamically change (unlikely)
    // const handleResize = () => setDeviceType(getDeviceType());
    // window.addEventListener('resize', handleResize);
    // return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return boolean flags for convenience
  const isDesktop = deviceType === 'desktop';
  const isAndroid = deviceType === 'android_device' || deviceType === 'android_webview';
  const isAndroidWebView = deviceType === 'android_webview';
  const isMobile = isAndroid || deviceType === 'ios_device'; // Include iOS for a general 'mobile' flag

  return {
    deviceType,
    isDesktop,
    isAndroid,
    isAndroidWebView,
    isMobile,
    // Add other flags if you need to distinguish iOS, etc.
  };
}

export default useDeviceDetection;