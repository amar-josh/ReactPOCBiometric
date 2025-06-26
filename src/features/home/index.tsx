import { useNavigate } from "react-router";

import HomeCard from "@/features/home/component/HomeCard";
import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";

import { INSTA_SERVICES_CARDS } from "./constants";
import { getIconBasedOnModuleKey } from "./utils";

const Home = () => {
  const navigate = useNavigate();

  const handleRedirection = (id: string) => {
    switch (id) {
      case "re_kyc":
        navigate(ROUTES.RE_KYC);
        break;
      case "mobile_number_update":
        navigate(ROUTES.MOBILE_NUMBER_UPDATE);
        break;
      default:
        return;
    }
  };

  const name = "Lorem Ipsum";

  return (
    <div className="px-12 py-8">
      <h2 className="text-2xl mb-6">
        <span className="pr-2">👋</span> {translator("home.welcome")},{" "}
        <span className="text-primary">{name}!</span>
      </h2>
      <h2 className="text-xl">{translator("home.subTitle")}</h2>
      <hr className="border-gray-400 my-6" />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
        {INSTA_SERVICES_CARDS?.map((card) => {
          return (
            <HomeCard
              key={card.moduleKey}
              icon={getIconBasedOnModuleKey(card.moduleKey)}
              label={card.moduleName}
              description={card.moduleDesc}
              onClick={() => handleRedirection(card.moduleKey)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
