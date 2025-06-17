import { useNavigate } from "react-router";

import FullScreenLoader from "@/components/common/FullScreenLoader";
import { ERROR } from "@/constants/globalConstant";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { ROUTES } from "@/routes/constants";

import HomeComponent from "./component/HomePage";
import { useGetInstaServices } from "./hooks";

const Home = () => {
  const { data, isLoading, error, isError } = useGetInstaServices();
  const navigate = useNavigate();

  const instaServices = data?.data?.instaServices[0].modules;

  const { alertMessage } = useAlertMessage(ERROR, error?.message, isError);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const handleNavigate = () => {
    //TODO -  Need to  route conditionally based on key
    navigate(ROUTES.RE_KYC);
  };

  return (
    <>
      <HomeComponent
        onHandleClick={handleNavigate}
        instaServices={instaServices}
        alertMessage={alertMessage}
      />
    </>
  );
};

export default Home;
