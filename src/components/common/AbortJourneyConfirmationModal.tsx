import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import translator from "@/i18n/translator";

interface IAbortJourneyConfirmationModal {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  description: string;
  icon: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function AbortJourneyConfirmationModal({
  open,
  onCancel,
  onConfirm,
  description,
  icon,
  confirmLabel = "button.yesCancel",
  cancelLabel = "button.no",
}: IAbortJourneyConfirmationModal) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="w-100 text-center py-0 p-4 md:p-7 [&>button]:hidden gap-0">
        <div className="flex justify-center">
          <img src={icon} alt="warning" className="mx-auto h-20 w-20" />
        </div>

        <DialogDescription className="text-base text-black">
          {translator(description)}
        </DialogDescription>

        <div className="flex flex-row items-center pt-5 justify-center gap-4">
          <Button onClick={onCancel} variant={"primary"} className="min-w-20">
            {translator(cancelLabel)}
          </Button>
          <Button onClick={onConfirm} variant={"outline"}>
            {translator(confirmLabel)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
