import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

interface IInfoMessageProps {
  icon: string;
  message: string;
  className?: string;
}

const InfoMessage = ({ icon, message, className }: IInfoMessageProps) => {
  return (
    <div
      className={cn(className, "font-normal text-sm flex items-center gap-x-1")}
    >
      <img src={icon} alt="info" className="w-3 h-3" />
      {translator(message)}
    </div>
  );
};

export default InfoMessage;
