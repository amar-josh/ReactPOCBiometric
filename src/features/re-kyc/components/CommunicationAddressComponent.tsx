import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IAddress } from "@/features/re-kyc/types";
import { cn } from "@/lib/utils";

import { formatAddress } from "../utils";

interface CommunicationAddressComponentProps {
  title: string;
  description: IAddress;
  isSelected: boolean;
}

export function CommunicationAddressComponent({
  title,
  description,
  isSelected,
}: CommunicationAddressComponentProps) {
  return (
    <Card className={cn(isSelected && "border-2 border-blue-500 bg-blue-50")}>
      <CardHeader>
        <CardTitle className="pt-1 font-bold ">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <hr className="p-4" />
        <p>{formatAddress(description)}</p>
      </CardContent>
    </Card>
  );
}
