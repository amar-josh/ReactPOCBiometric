import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import translator from "@/i18n/translator";
import { ROUTES } from "@/routes/constants";

interface IPageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: IPageHeaderProps) => {
  const navigate = useNavigate();
  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-semibold">{translator(title)}</h2>
      <Button variant="outline" className="border-none" onClick={backToHome}>
        <ArrowLeft />
        {translator("reKyc.home")}
      </Button>
    </div>
  );
};

export default PageHeader;
