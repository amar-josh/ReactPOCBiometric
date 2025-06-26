import { useLocation, useNavigate } from "react-router";

import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";
import { getIsTokenSet } from "@/services/api.service";

import AccessErrorCard from "./AccessErrorCard";
import { ErrorBoundary } from "./ErrorBoundary";

const ErrorBoundaryWrapper = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = getIsTokenSet();

  const handleClick = () => {
    navigate(token ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
  };

  return (
    <ErrorBoundary
      key={location.pathname}
      fallback={
        <AccessErrorCard
          title={translator("reKyc.errorMessages.oops")}
          primaryButtonText={translator(
            token ? "button.backToHome" : "button.backToLogin"
          )}
          description={translator("reKyc.errorMessages.somethingWentWrong")}
          onClickPrimaryButton={handleClick}
        />
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
