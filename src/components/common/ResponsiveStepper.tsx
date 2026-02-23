import MobileStepper from "@/features/mobile-number-update/components/MobileStepper";
import Stepper from "./Stepper";

interface IResponsiveStepperProps {
  steps: string[];
  currentStep: number;
  completed: {
    [k: number]: boolean;
  };
}

const ResponsiveStepper = ({
  steps,
  currentStep,
  completed,
}: IResponsiveStepperProps) => {
  return (
    <>
      <div className="w-1/4 hidden lg:block">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          completed={completed}
        />
      </div>
      <div className="block lg:hidden">
        <MobileStepper
          steps={steps}
          currentStep={currentStep}
          completed={completed}
        />
      </div>
    </>
  );
};

export default ResponsiveStepper;
