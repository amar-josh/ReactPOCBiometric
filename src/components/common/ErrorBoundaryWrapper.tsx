import { useLocation, useNavigate } from "react-router";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { getSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";

import AccessErrorCard from "./AccessErrorCard";
import { ErrorBoundary } from "./ErrorBoundary";

const ErrorBoundaryWrapper = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = getSessionStorageData<string>(SESSION_STORAGE_KEY.TOKEN);

  const handleClick = () => {
    navigate(token ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
  };

  return (
    <ErrorBoundary
      key={location.pathname}
      fallback={
        <AccessErrorCard
          title={"reKyc.errorMessages.oops"}
          primaryButtonText={token ? "button.backToHome" : "button.backToLogin"}
          description={"reKyc.errorMessages.somethingWentWrong"}
          onClickPrimaryButton={handleClick}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
