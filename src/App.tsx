
import { useState } from 'react';
import './App.css'

// Extend the Window interface to include NativeCallback
declare global {
  interface Window {
    NativeCallback?: {
      sendRequest?: (method: string, args: any) => Promise<any>;
    };
  }
}


function App() {

   const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState(''); 

 const getDeviceStatus = async () => {
  try {
    const response = await fetch("https://localhost:11101/", {
      method: "RDSERVICE", // Custom RDService method (uncommon but required by L1 RD)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("RD Service Raw Response:", response);
    const text = await response.text();
    alert("RD Service Raw Response: " + text);
    console.log("RD Service Raw Response:", text);
  } catch (err) {
    alert("RD Service Raw error Response: " + err);
    console.error("Error while calling RD service:", err);
  }
};

const getDeviceInfo = async () => {
  try {
    const response = await fetch("https://localhost:11101/getDeviceInfo", {
      method: "DEVICEINFO", // Custom method for RD Service
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Device Info Response:", response);
    const text = await response.text();
    alert("Device infor Response: " + text);
    console.log("Device Info Response XML:", text);
    // parse or return text as needed
  } catch (error) {
     alert("Device infor error Response: " + error);
    console.error("Error getting device info:", error);
  }
};


 const captureBiometric = async () => {
  try {
 const xmlBody = `<PidOptions ver="1.0"><Opts env="PP" fCount="1" fType="0" iCount="" iType="" pCount="" pType="" format="0" pidVer="2.0" timeout="150000" otp="" wadh="" posh=""/></PidOptions>`.trim();

    const response = await fetch("https://localhost:11101/capture", {
      method: "CAPTURE", // Custom method used by RD Service
      body: xmlBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Capture Response:", response);
    const text = await response.text();
     alert("Capture Response: " + text);
    console.log("Capture Response XML:", text);

    // You can parse `text` using DOMParser if needed
    // return text;

  } catch (error) {
    alert("Capture error Response: " + error);
    console.error("Error during RD capture:", error);
  }
};

const callFlutterMethod = async (method:string, args:{serviceId:string}) => {
    setResponseMessage('Calling Flutter...');
    setResponseType('');

    // Check if the communication bridge is ready
    if (window.NativeCallback && typeof window.NativeCallback.sendRequest === 'function') {
      try {
        const response = await window.NativeCallback.sendRequest(method, args);
        console.log('React App: Received successful response from Flutter:', response);
        setResponseMessage(`Success: ${response.response || 'Operation completed.'}`);
        setResponseType('success');
        // You can now use response.data (e.g., transactionId, billRef)
      } catch (errorResponse: unknown) {
        console.error('React App: Received error response from Flutter:', errorResponse);
        const errorMsg = (errorResponse && typeof errorResponse === 'object' && 'message' in errorResponse)
          ? (errorResponse as { message?: string }).message
          : (errorResponse instanceof Error ? errorResponse.message : undefined);
        setResponseMessage(`Error: ${errorMsg || 'Operation failed.'}`);
        setResponseType('error');
        // Handle errorResponse.data (e.g., errorCode)
      }
    } else {
      console.warn('React App: NativeCallback is not available or not correctly injected.');
      setResponseMessage('Error: Not in Flutter WebView environment or communication not set up.');
      setResponseType('error');
    }
  };

  const checkServiceStatus = () => {
    callFlutterMethod('callingBiometricServices', { serviceId: 'SERVICE_STATUS'});
  };

   const checkDeviceStatus = () => {
    callFlutterMethod('callingBiometricServices', { serviceId: 'DEVICE_STATUS'});
  };

   const captureFingerPrint = () => {
    callFlutterMethod('callingBiometricServices', { serviceId: 'CAPTURE_FINGERPRINT' });
  };


  return (
    <>
      <div>
         <div className='d-flex justify-content-center align-items-center vh-100' > 
          <div>
        <h2>Web Application</h2>
         <button  onClick={getDeviceStatus}>Check Service Status</button>
          <button onClick={getDeviceInfo}>Check Device Status</button>
        <button onClick={captureBiometric}>Capture Fingerprint</button>
        </div>
        <div>
        <h2>Android Application</h2>
        <button  onClick={checkServiceStatus}>Check Service Status</button>
          <button onClick={checkDeviceStatus}>Check Device Status</button>
        <button onClick={captureFingerPrint}>Capture Fingerprint</button>
        </div>
        </div>
        <div className='response-message'>
          {responseMessage && (
            <div className={`alert alert-${responseType}`}>
              {responseMessage}
            </div>
          )}
          </div>
      </div>
    </>
  )
}

export default App
