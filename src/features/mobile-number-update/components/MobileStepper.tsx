import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

interface IMobileNumberStepperProps {
  steps: string[];
  currentStep: number;
  completed: {
    [k: number]: boolean;
  };
}

export default function MobileNumberStepper({
  steps,
  currentStep,
  completed,
}: IMobileNumberStepperProps) {
  return (
    <div className="md:px-6 md:pt-6 md:pb-10 px-6 pt-6 flex md:flex-col-reverse flex-col">
      {/* Left side: Step name */}
      <div
        data-testid="current-step-label"
        className="flex flex-col md:mt-7 md:mb-0  mb-6  items-start  md:py-0 text-xl md:text-2xl font-semibold"
      >
        <div>{translator(steps[currentStep - 1])}</div>
      </div>

      {/* Center: Stepper */}
      <div className="relative flex md:mb-0 mb-6 w-full mx-auto flex-1">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = completed[stepNum];
          const isActive = currentStep === stepNum;
          const nextSteps = stepNum > currentStep;
          const isLast = index === steps.length - 1;

          const nextStepNum = stepNum;
          const nextIsCompleted = completed[nextStepNum];

          const lineColor = nextIsCompleted ? "bg-green-100" : "bg-gray-100";

          return (
            <div
              key={label}
              className="relative flex flex-col items-center flex-1"
            >
              <div
                className={cn(
                  "z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                  {
                    "bg-green-100 text-green-800 border-none": isCompleted,
                    "bg-primary text-white border-none":
                      isActive && !isCompleted,
                    "bg-gray-50 text-gray-400 border-gray-300": nextSteps,
                  }
                )}
              >
                {stepNum}
              </div>

              <div
                className={cn("mt-1 text-xs text-center w-20 ", {
                  "text-green-800": isCompleted,
                  "text-primary": isActive && !isCompleted,
                  "text-dark-gray": nextSteps,
                })}
              >
                <div>{translator(label)}</div>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "absolute top-3 left-1/2 w-full h-0.5 z-0",
                    lineColor
                  )}
                  style={{ right: "-50%" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
