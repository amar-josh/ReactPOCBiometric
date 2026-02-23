import "./App.css";

import { useEffect } from "react";

import { SESSION_STORAGE_KEY } from "./constants/globalConstant";
import useDisableDevTool from "./hooks/useDisableDevTool";
import { getSessionStorageData } from "./lib/sessionStorage";
import RoutesComponent from "./routes/RoutesComponent";
import { updateTokenValue } from "./services/api.service";

function App() {
  // Below code prevent user opening dev tools
  useDisableDevTool();

  // Check if token exists in session storage and update the token value once reloaded in authorization header
  useEffect(() => {
    const token = getSessionStorageData(SESSION_STORAGE_KEY.TOKEN);
    if (token) {
      updateTokenValue(token);
    }
  }, []);

  return (
    <>
      <RoutesComponent />
    </>
  );
}

export default App;
