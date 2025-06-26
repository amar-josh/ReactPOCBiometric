import error from "@/assets/images/error.svg";
import success from "@/assets/images/success.svg";
import { Card, CardContent } from "@/components/ui/card";
import translator from "@/i18n/translator";

import { Button } from "../ui/button";

export interface IAddressUpdateData {
  requestNumber?: string;
}

export interface IResponseStatusComponentProps {
  status: "success" | "failure";
  title: string;
  message: string;
  requestNumber?: string;
  oldMobileNumber?: string;
  newMobileNumber?: string;
  backToHome: () => void;
}
const ResponseStatusComponent = ({
  status,
  title,
  message,
  requestNumber,
  oldMobileNumber,
  newMobileNumber,
  backToHome,
}: IResponseStatusComponentProps) => {
  const isSuccess = status === "success";
  const Icon = isSuccess ? success : error;

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="bg-light-gray w-full mx-auto p-6 text-center rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center gap-3">
          <div className=" p-3 rounded-full">
            <img src={Icon} className="text-white " />
          </div>
          <h2 className="font-semibold text-xl">{translator(title)}</h2>
          <p className="font-semibold text-lg">{translator(message)}</p>
          {requestNumber && (
            <p className="text-sm">
              <span className="text-primary text-lg">
                {translator("requestNumber")}
              </span>
              <span className="text-gray-500 px-2">{requestNumber}</span>
            </p>
          )}
          {oldMobileNumber && newMobileNumber && (
            <>
              <p className="text-sm">
                <span className="text-primary text-lg">
                  {translator("mobileNumberUpdate.oldMobileNumber")}
                </span>
                <span className="text-gray-500">{oldMobileNumber}</span>
              </p>
              <p className="text-sm">
                <span className="text-primary text-lg">
                  {translator("mobileNumberUpdate.newMobileNumber")}
                </span>
                <span className="text-gray-500">{newMobileNumber}</span>
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button variant="primary" onClick={backToHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default ResponseStatusComponent;
