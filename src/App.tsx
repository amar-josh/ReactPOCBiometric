
import './App.css'

function App() {

 const getDeviceStatus = async () => {
  try {
    const response = await fetch("https://localhost:11101/", {
      method: "RDSERVICE", // Custom RDService method (uncommon but required by L1 RD)
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Connection": "keep-alive",
        "Origin": "null",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        // "sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("RD Service Raw Response:", response);
    const text = await response.text();
    console.log("RD Service Raw Response:", text);

    // You can parse the XML here to extract <RDService status="READY" ... />
    // Example:
    // const parser = new DOMParser();
    // const xml = parser.parseFromString(text, "text/xml");
    // const status = xml.getElementsByTagName("RDService")[0]?.getAttribute("status");

    // return fetchFakeData("READY"); // Replace with actual parsed status

  } catch (err) {
    console.error("Error while calling RD service:", err);
  }
};

const getDeviceInfo = async () => {
  try {
    const response = await fetch("https://localhost:11101/getDeviceInfo", {
      method: "DEVICEINFO", // Custom method for RD Service
      headers: {
        "Accept": "*/*",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Connection": "keep-alive",
        "Origin": "null",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        // "sec-ch-ua": `"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Device Info Response:", response);
    const text = await response.text();
    console.log("Device Info Response XML:", text);
    // parse or return text as needed
  } catch (error) {
    console.error("Error getting device info:", error);
  }
};


 const captureBiometric = async () => {
  try {
 const xmlBody = `<PidOptions ver="1.0"><Opts env="PP" fCount="1" fType="0" iCount="" iType="" pCount="" pType="" format="0" pidVer="2.0" timeout="150000" otp="" wadh="" posh=""/></PidOptions>`.trim();

    const response = await fetch("https://localhost:11101/capture", {
      method: "CAPTURE", // Custom method used by RD Service
      headers: {
        "Accept": "text/xml",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        "Connection": "keep-alive",
        "Content-Type": "text/xml",
        "Origin": "null",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        // "sec-ch-ua": `"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
      },
      body: xmlBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Capture Response:", response);
    const text = await response.text();
    console.log("Capture Response XML:", text);

    // You can parse `text` using DOMParser if needed
    // return text;

  } catch (error) {
    console.error("Error during RD capture:", error);
  }
};



  return (
    <>
      <div onClick={getDeviceStatus}>check status</div>
       <div onClick={getDeviceInfo}>Device info</div>
      <div onClick={captureBiometric}>capture</div>
    </>
  )
}

export default App
