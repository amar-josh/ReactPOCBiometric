import clsx from "clsx";
import { AlertTriangle, CheckCircle, InfoIcon, XCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface IAlertMessageProps {
  type: "success" | "warning" | "error" | "info";
  message: string;
}

const AlertMessage = ({ type, message }: IAlertMessageProps) => {
  const icons = {
    success: <CheckCircle className="size-5 text-success" />,
    warning: <AlertTriangle className="size-5 text-warning" />,
    error: <XCircle className="size-5 text-danger" />,
    info: <InfoIcon className="size-5 text-info" />,
  };

  const bgColors = {
    success: "bg-success-background text-success border-success-bd",
    warning: "bg-warning-background text-warning border-warning-bd",
    error: "bg-danger-background text-danger border-danger-bd",
    info: "bg-info-background text-info border-info-bd",
  };

  return (
    <Alert
      className={clsx(
        "flex items-start gap-2 rounded-md px-4 py-2 text-sm border-1",
        bgColors[type]
      )}
    >
      {icons[type]}
      <div className="flex-1">
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
};

export default AlertMessage;
