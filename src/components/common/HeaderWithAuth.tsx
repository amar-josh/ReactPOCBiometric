import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import translator from "@/i18n/translator";

import logo from "../../assets/images/BandhanBankWhite.svg";
import { getInitials } from "@/layout/utils";

interface IHeaderWithAuthProps {
  name?: string | null;
  branch?: string | null;
  handleLogout: () => void;
}

const HeaderWithAuth = ({
  name,
  branch,
  handleLogout,
}: IHeaderWithAuthProps) => {
  return (
    <header className="bg-primary h-15 flex items-center justify-between gap-4 pr-6 md:pr-10 pl-7  py-5 rounded-none">
      <img src={logo} alt="Bandhan Bank" className="h-8" />
      <div className="flex items-center">
        <div
          className="flex items-center gap-2.5 cursor-pointer text-white mr-14"
          onClick={handleLogout}
        >
          <LogOutIcon />
          <p className="text-sm hidden md:block ">
            {translator("header.logout")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-7 border border-info-background">
            <AvatarImage src={""} alt="User" />
            <AvatarFallback className="bg-gray-50 text-xs">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col hidden md:block">
            <p className="text-blue text-sm">{name || "-"}</p>
            <p className="text-white text-xs">
              {translator("header.branchOrBu")}: {branch || "-"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithAuth;
