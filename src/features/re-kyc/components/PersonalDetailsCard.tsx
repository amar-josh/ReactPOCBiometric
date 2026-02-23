import CardWrapper from "@/components/common/InfoCardWrapper";
import translator from "@/i18n/translator";

interface IPersonalDetailsCardProps {
  name: string;
  email: string;
  mobile: string;
  avatarUrl?: string;
}

const PersonalDetailsCard = ({
  name,
  email,
  mobile,
  avatarUrl,
}: IPersonalDetailsCardProps) => {
  return (
    <CardWrapper
      title={translator("reKyc.personalDetails")}
      className="bg-light-gray"
    >
      <div className="flex items-center gap-6">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col justify-between w-full">
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="flex flex-col md:flex-row gap-0 md:gap-10">
            <div className="flex gap-2">
              <p className="text-md">{translator("email")}:</p>
              <p className="text-muted-foreground text-md">{email}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-md">{translator("mobileNumber")}:</p>
              <p className="text-muted-foreground text-md">
                XXXXXX{String(mobile).slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
export default PersonalDetailsCard;
