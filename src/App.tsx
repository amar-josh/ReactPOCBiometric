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
    const token ="eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzMjE0NSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4MzU3NDUsImlhdCI6MTc3MTgzMjE0NSwidmVyc2lvbiI6MiwianRpIjoiYTg1OTkyODEtNmZjYi00MWVmLWIwNWMtY2JmY2EyNmE2YTZmIiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.c3AhTt-ulOVLYkW9t9AQ4optQ32c52asdI_oTNl5aG0_CdG38mN_d85r8VLzjL_YBNhQUqoRNBbS-Te7HQ8EXJNn48BJckCDfLmOsAN99WZEh558hldFEMqq9NKFoGvWNkO8r5U3uLsThLcoSSeBuNvDIs1ZpLuTMflMtda6w2e7lzqZKrPh2vkmj_nG1ctXCFFrwkJer0P0rd-2JHgRlXfOYvCbFebyyq-WY7N2T-Nw9lWv_wqmWfJtL-RnE9NRUzL7QL0_0glfaOv2QBibhuEVMHCEyxY-RBGkA_wI55ZdcNLW3jIuB78Vm6TE8pbIlZCBg2EH58o9ThUAjfiPgw";
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
