import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import FullScreenLoader from "@/components/common/FullScreenLoader";
import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { setSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";
import { updateTokenValue } from "@/services/api.service";

const ADFSLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const empName = searchParams.get("empName");
  const empId = searchParams.get("empId");
  const branchCode = searchParams.get("empLocation");
  const department = searchParams.get("empDepartment");
  useEffect(() => {
    if (token) {
      const empInfo = {
        empName,
        empId,
        branchCode,
        department,
      };
      setSessionStorageData(SESSION_STORAGE_KEY.TOKEN, token);
      setSessionStorageData(SESSION_STORAGE_KEY.EMP_INFO, empInfo);
      updateTokenValue(token);
      navigate(ROUTES.HOME);
    }
  }, [token, empName, empId, branchCode, department, navigate]);

  return <div>{!token && <FullScreenLoader />}</div>;
};

export default ADFSLogin;
