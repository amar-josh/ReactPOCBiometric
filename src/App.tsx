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
    const token ="eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzMjU2NCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4MzYxNjQsImlhdCI6MTc3MTgzMjU2NCwidmVyc2lvbiI6MiwianRpIjoiZWVhNmU4NWItNzE0ZC00OTgxLWExYjEtODg2MjFlNTg2ZjM4IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.LzaA8cfKiL7enfpjg9gKq5NKAEKp3flp-n7FoYiyOQtGUDFtXeK2oWgAE59nJZB20Vd7lMIsLTOougkg-59nKm666Jq92rMjqlyqxQrMuqeNQ5xsXnVxMLW241-F3tn2v6ltfyDmJ15o-wD68DpFyGNVsmdvivux6eejDU1qZ6FYVyojJyxv2akwVgvKzFd_ALSyPc9Tz1JZmDaJK0x1lcipkLL-oH0_QecMF63_jRWVN7F1CRupZFzyKoKqbTQAWWBgAC_iHIaoB23fQ4nE36YRKZa7UbB8OQO2yHkGHZQELxR4nYinIciIMHb2yD1Wn3Ta0SnLfLMuehb06Caa6Q";
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
