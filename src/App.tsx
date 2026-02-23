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
    const token = "Bearer eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzMjkwNCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4MzY1MDQsImlhdCI6MTc3MTgzMjkwNCwidmVyc2lvbiI6MiwianRpIjoiYmVlOTIwZmItZTkxMC00NDk0LWIyNDItNGU5NmNhMjg4NzU4IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.gr3q86FEZTnEPtvURPF8RMGPsxEyeWQ6DJQpaf6EyEDND3vTdGA1S28IWenILtHKRVV5WaDO4rlDEpPl1cQ7nwDwf_Lw0o6fyuDG_4n5rY1Aoaq1gO3erI9b2UPYErdQu4eoJCQ3IvAgjaht3V-i_MGaPxCa4mwJ2DUPBjIJ67x8rk7x-qxRkvtOCfmfEyuVDvHQTYEzrSLB8s-67dAVGGuoQppAPvwSd1N7708hT7XLnu6GwK6oECJwt93j0BaP3k2GqcnB-ifRwECoH6YIYXchr2jFeQgZhNKzHhaNoS9uWOLL4EOjwPajGjQNVMAu1Fmc0-kQH_gR5p4HlHtalw";
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
