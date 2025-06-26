import aadhaar from "@/assets/images/aadhaarGray.svg";
import eligibility from "@/assets/images/eligibility.svg";
import risk from "@/assets/images/risk.svg";
import user from "@/assets/images/user.svg";
import { Card, CardContent } from "@/components/ui/card";
import translator from "@/i18n/translator";

const EligibilityCard = () => {
  return (
    <Card className="flex flex-col md:flex-row items-center md:items-start justify-between px-11 py-8 border-none bg-gray-100">
      <CardContent className="flex flex-col space-y-4 w-full p-0">
        <h2 className="text-xl font-semibold text-black">
          {translator("instaServiceEligibilityCard.title")}
        </h2>
        <div className="flex w-full items-start justify-between">
          <ul className="flex-1 space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <img src={user} alt="user" className="w-5 h-5" />
              {translator("instaServiceEligibilityCard.eligibilityOne")}
            </li>
            <li className="flex items-center gap-2">
              <img src={aadhaar} alt="aadhaar" className="w-5 h-5" />
              {translator("instaServiceEligibilityCard.eligibilityTwo")}
            </li>
            <li className="flex items-center gap-2">
              <img src={risk} alt="risk" className="w-5 h-5" />
              {translator("instaServiceEligibilityCard.eligibilityThree")}
            </li>
          </ul>
          <img
            src={eligibility}
            alt="eligibility"
            className="w-24 h-24 object-contain ml-6"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EligibilityCard;
