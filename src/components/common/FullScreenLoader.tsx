import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
      <Loader2
        data-testid="spinner"
        className="w-12 h-12 animate-spin text-primary"
      />
    </div>
  );
};

export default FullScreenLoader;
