import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            {translator("login.regainAccountAccess")}
          </DialogTitle>
        </DialogHeader>
        <p className="text-4xl font-bold text-blue-700 mt-2">1234-567-0000</p>
        <div className="mt-6 flex justify-center">
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
