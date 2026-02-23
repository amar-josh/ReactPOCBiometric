import { useEffect } from "react";
import { useNavigate } from "react-router";

import HomeCard from "@/features/home/component/HomeCard";
import { useGetConfig } from "@/hooks/useConfig";
import translator from "@/i18n/translator";
import { aesGcmUtil } from "@/lib/encryptionDecryption";
import { setTransactionId } from "@/lib/utils";

import { useEmpInfo } from "../adfs-login/hooks";
import { INSTA_SERVICES_CARDS } from "./constants";

const Home = () => {
  const navigate = useNavigate();

  const { mutate: getConfig, data: configData } = useGetConfig();

  const handleRedirection = (path: string) => {
    navigate(path);
  };

  const empInfo = useEmpInfo();

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  useEffect(() => {
    if (configData?.data) {
      const { aesKey } = configData.data;
      aesGcmUtil.setKey(aesKey);
      setTransactionId("");
    }
  }, [configData]);

  return (
    <div className="px-6 md:px-12 py-8">
      <h2 className="text-2xl mb-6">
        <span className="pr-2">👋</span> {translator("home.welcome")},{" "}
        <span className="text-primary">{empInfo?.empName || "-"}!</span>
      </h2>
      <h2 className="text-xl">{translator("home.subTitle")}</h2>
      <hr className="border-gray-400 my-6" />
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
        {INSTA_SERVICES_CARDS?.map((card) => {
          return (
            <HomeCard
              key={card.key}
              icon={card.icon}
              label={card.name}
              description={card.description}
              onClick={() => handleRedirection(card.path)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
