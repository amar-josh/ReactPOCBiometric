import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAddress } from "@/features/re-kyc/types";
import { cn } from "@/lib/utils";

interface CommunicationAddressComponentProps {
  title: string;
  address: IAddress | undefined;
  isSelected: boolean;
}

export function CommunicationAddressComponent({
  title,
  address,
  isSelected,
}: CommunicationAddressComponentProps) {
  if (!address) {
    return null;
  }

  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    country,
    state,
    pinCode,
  } = address;
  return (
    <Card
      className={cn("gap-3 py-4", {
        "border-1 border-blue bg-blue-50 mb-4": isSelected,
      })}
    >
      <CardHeader>
        <CardTitle
          className={cn("font-semibold text-base", {
            "text-primary": isSelected,
          })}
        >
          {title}
        </CardTitle>
        <hr className={cn("px-4", { "border-blue": isSelected })} />
      </CardHeader>
      <CardContent className="text-sm font-normal">
        <div>
          <p>
            {addressLine1 || ""} <br />
            {addressLine2 && (
              <>
                {addressLine2} <br />
              </>
            )}
            {addressLine3 || ""}
          </p>
          <p>{`${city}, ${state}, ${country}, ${pinCode}`}</p>
        </div>
      </CardContent>
    </Card>
  );
}
