// YourComponent.js
import React from 'react';
import useDeviceDetection  from './useDeviceDetection'; // Assuming this is where your hook is defined
function DeviceDetect() {
  const { deviceType, isDesktop, isAndroid, isAndroidWebView, isMobile } = useDeviceDetection();

  if (deviceType === 'loading') {
    return <p>Detecting device type...</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Current Device Type: <strong>{deviceType}</strong></p>

      {isDesktop && (
        <p>You are using a <strong>Desktop</strong> browser.</p>
      )}

      {isAndroid && !isAndroidWebView && (
        <p>You are using a <strong>Native Android Browser</strong>.</p>
      )}

      {isAndroidWebView && (
        <p>You are using an <strong>Android App's WebView</strong>.</p>
      )}

      {isMobile && (
        <p>This is a <strong>Mobile Device</strong>.</p>
      )}

      
    </div>
  );
}


export default DeviceDetect;