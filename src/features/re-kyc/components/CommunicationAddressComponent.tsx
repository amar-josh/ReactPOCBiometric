import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IAddress } from "@/features/re-kyc/types";
import { cn } from "@/lib/utils";

import { formatAddress } from "../utils";

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
  return (
    <Card className={cn(isSelected && "border border-blue-500 bg-blue-50")}>
      <CardHeader>
        <CardTitle className="pt-1 font-bold ">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Separator />
        <p className="mt-4">{address && formatAddress(address)}</p>
      </CardContent>
    </Card>
  );
}
