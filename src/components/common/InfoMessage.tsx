import translator from "@/i18n/translator";

interface IInfoMessageProps {
  icon: string;
  message: string;
}

const InfoMessage = ({ icon, message }: IInfoMessageProps) => {
  return (
    <div className="font-normal text-sm flex items-center gap-x-1">
      <img src={icon} alt="info" className="w-4 h-4" />
      {translator(message)}
    </div>
  );
};

export default InfoMessage;
