import accessDeniedIcon from "@/assets/images/notAllowed.svg";
import translator from "@/i18n/translator";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

type IButtonProps =
  | "default"
  | "destructive"
  | "outline"
  | "primary"
  | "ghost"
  | "link";

interface IAccessErrorCard {
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonType?: IButtonProps;
  onClickPrimaryButton: () => void;
}

const AccessErrorCard = ({
  title,
  description,
  primaryButtonText = "button.backToLogin",
  primaryButtonType = "primary",
  onClickPrimaryButton,
}: IAccessErrorCard) => {
  return (
    <div className="flex items-center justify-center h-screen px-4 sm:px-6 lg:px-0 my-10">
      <Card className="max-w-xl shadow-md">
        <div className="flex flex-col items-center justify-center text-center px-6 py-10 sm:px-10 sm:py-12">
          <img
            src={accessDeniedIcon}
            alt="Access Denied"
            className="h-20 w-20 mb-6"
          />
          <h2 className="text-black text-2xl font-semibold mb-4">
            {translator(title)}
          </h2>
          <div className="text-xl font-medium">{translator(description)}</div>
          <Button
            variant={primaryButtonType}
            onClick={onClickPrimaryButton}
            className="mt-8"
          >
            {translator(primaryButtonText)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccessErrorCard;
