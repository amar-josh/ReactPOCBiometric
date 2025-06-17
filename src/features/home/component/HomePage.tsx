import AlertMessage from "@/components/common/AlertMessage";
import HomeCard from "@/components/common/HomePageCard";
import { IInstaModule } from "@/features/home/types";
import translator from "@/i18n/translator";
import { IAlertMessage } from "@/types";

import { getIconBasedOnModuleKey } from "../utils";

const name = "Lorem Ipsum";

interface IHomeComponentProps {
  onHandleClick: () => void;
  instaServices: IInstaModule[];
  alertMessage: IAlertMessage;
}

const HomeComponent = ({
  onHandleClick,
  instaServices,
  alertMessage,
}: IHomeComponentProps) => {
  return (
    <div className="p-12">
      <h2 className="text-4xl mb-12">
        <span className="pr-2">👋</span> {translator("home.welcome")},{" "}
        <span className="text-primary">{name}</span>
      </h2>
      <h2 className="text-4xl">{translator("home.subTitle")}</h2>
      <hr className="border-gray-400 my-6" />
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-8">
        {instaServices?.map((card) => {
          return (
            <HomeCard
              moduleKey={card.moduleKey}
              icon={getIconBasedOnModuleKey(card.moduleKey)}
              label={card.moduleName}
              description={card.moduleDesc}
              onHandleClick={onHandleClick}
            />
          );
        })}
      </div>
      {alertMessage.message && (
        <AlertMessage type={alertMessage.type} message={alertMessage.message} />
      )}
    </div>
  );
};

export default HomeComponent;
