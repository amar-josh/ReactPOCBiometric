import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

import rightArrow from "../../assets/images/arrow-right.svg";
import check from "../../assets/images/check.svg";

interface IStepperProps {
  steps: string[];
  currentStep: number;
  completed: {
    [k: number]: boolean;
  };
}

export default function Stepper({
  steps,
  currentStep,
  completed,
}: IStepperProps) {
  return (
    <div className="space-y-3">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const nextSteps = stepNum > currentStep;

        return (
          <div
            key={label}
            className={cn("flex rounded-md p-3 font-medium border-1", {
              "bg-green-50 text-green-800 border-green-300": completed[stepNum],
              "bg-blue-50 text-blue-800 border-blue-300":
                isActive && !completed[stepNum],
              "bg-gray-50 text-gray-400 border-gray-300": nextSteps,
            })}
          >
            <p>{stepNum}.</p> {translator(label)}
            <div className="flex-end ml-auto">
              {isActive && !completed[stepNum] && <img src={rightArrow} />}
              {completed[stepNum] && <img src={check} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
