import { MoveRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import translator from "@/i18n/translator";

export interface IHomeCardProps {
  icon: string;
  label: string;
  description: string;
  onClick: () => void;
}

const HomeCard = ({ icon, label, description, onClick }: IHomeCardProps) => {
  return (
    <div className="pt-10">
      <Card className="flex flex-col h-full relative rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--blue)] text-white shadow-lg py-0">
        <div className="size-24 flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 bg-light-gray border-4 border-white p-2 rounded-full shadow-md">
          <img src={icon} />
        </div>

        <CardContent className="flex flex-col flex-1 text-center pt-18 px-4 pb-7 items-center">
          <div className="flex-1 flex flex-col justify-start mb-4">
            <h2 className="text-lg font-semibold mb-2">{translator(label)}</h2>
            <p className="text-sm text-white/90 leading-tight">
              {translator(description)}
            </p>
          </div>

          <Button onClick={onClick} variant={"primary"}>
            {translator("button.proceed")}
            <MoveRightIcon />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeCard;
