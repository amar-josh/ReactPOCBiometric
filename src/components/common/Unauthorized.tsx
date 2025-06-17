import { useNavigate } from "react-router";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { ROUTES } from "@/routes/constants";

import AccessErrorCard from "./AccessErrorCard";

const Unauthorized = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY.TOKEN);
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
