import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SUPPORT_EMAIL } from "@/constants/globalConstant";
import translator from "@/i18n/translator";

interface IRegainAccessModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const RegainAccessModal = ({
  showModal,
  setShowModal,
}: IRegainAccessModalProps) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="[&>button]:hidden w-100 text-center gap-0">
        <DialogHeader>
          <DialogTitle className=" text-base font-medium text-center mb-2">
            {translator("login.regainAccountAccess")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-base font-semibold text-primary mb-6">
          {SUPPORT_EMAIL}
        </p>
        <div className="flex justify-center">
          <DialogClose asChild>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              {translator("button.close")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegainAccessModal;
