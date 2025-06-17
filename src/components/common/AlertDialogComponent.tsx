import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

interface IAlertDialogProps {
  title: string;
  message?: string;
  type?: "info" | "warning" | "error";
  icon?: string;
  open?: boolean;
  onCancel?: () => void;
  onConfirm?: (action: string) => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  uniqueKey?: string | undefined;
}

const AlertDialogComponent = ({
  title,
  message,
  icon,
  type,
  open,
  onCancel,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  isLoading = false,
  uniqueKey,
}: IAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="flex flex-col items-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {translator(title)}
          </AlertDialogTitle>
          {icon && (
            <img src={icon} alt="fingerprint" className="mx-auto mb-4" />
          )}
          <AlertDialogDescription
            className={cn(
              "text-center font-medium text-base text-black",
              type === "info" && "text-info",
              type === "warning" && "text-warning",
              type === "error" && "text-danger"
            )}
          >
            {translator(message)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onConfirm && confirmButtonText && (
            <Button
              type="button"
              variant={"primary"}
              onClick={() => onConfirm(uniqueKey as string)}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              {confirmButtonText}
            </Button>
          )}
          {onCancel && cancelButtonText && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelButtonText}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogComponent;
