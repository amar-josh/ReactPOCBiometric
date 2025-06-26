import { useNavigate } from "react-router";

import { ROUTES } from "@/routes/constants";
import { clearToken } from "@/services/api.service";

import AccessErrorCard from "./AccessErrorCard";

const Unauthorized = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    clearToken();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AccessErrorCard
      title="unauthorized.title"
      description="unauthorized.message"
      onClickPrimaryButton={redirectToLogin}
    />
  );
};

export default Unauthorized;
