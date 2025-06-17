import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import translator from "@/i18n/translator";

import logo from "../../assets/images/BandhanBankWhite.svg";

const HeaderWithAuth = ({
  name,
  branch,
  handleLogout,
}: {
  name: string;
  branch: string;
  handleLogout: () => void;
}) => {
  return (
    <header className="bg-primary min-h-20 flex justify-between gap-4 px-12 py-5 rounded-none">
      <img src={logo} alt="Bandhan Bank" className="w-[168px]" />
      <div className="flex items-center">
        <div
          className="flex items-center gap-2.5 cursor-pointer text-white mr-14"
          onClick={handleLogout}
        >
          <LogOutIcon />
          <p>{translator("header.logout")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border border-info-background">
            <AvatarImage src={""} alt="User" />
            <AvatarFallback className="bg-gray-50">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-blue">{name}</p>
            <p className="text-white">
              {translator("header.branchOrBu")}:{branch}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithAuth;
