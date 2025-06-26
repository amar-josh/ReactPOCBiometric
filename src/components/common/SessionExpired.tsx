import { useNavigate } from "react-router";

import sessionExpired from "@/assets/images/notAllowed.svg";
import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";
import { clearToken } from "@/services/api.service";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

const SessionExpired = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    clearToken();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex items-center justify-center h-screen px-4 sm:px-6 lg:px-0 my-10">
      <Card className="max-w-xl shadow-md">
        <div className="flex flex-col items-center justify-center text-center px-6 py-6 sm:px-10">
          <img
            src={sessionExpired}
            alt="Session Expired"
            className="h-[60px] w-[60px] mb-6"
          />
          <div className="text-lg mb-8 font-bold">
            {translator("sessionExpired.message")}
          </div>
          <Button variant="primary" onClick={redirectToLogin}>
            {translator("button.backToLogin")}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SessionExpired;
