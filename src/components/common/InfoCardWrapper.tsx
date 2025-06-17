import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ICardWrapperProps {
  children: React.ReactNode;
  withRadio?: boolean;
  radioValue?: string;
  title?: string;
  subTitle?: string;
  subTitleInfo?: string;
  onSelect?: () => void;
  backgroundColor?: string;
  selectedBackgroundColor?: string; // Background when selected with radio
  selected?: boolean;
}

const CardWrapper = ({
  children,
  withRadio = false,
  radioValue,
  title,
  subTitle,
  subTitleInfo,
  onSelect,
  backgroundColor = "bg-white",
  selected = false,
}: ICardWrapperProps) => {
  return (
    <Card
      className={cn(
        "border-1 gap-0 border-gray-200 rounded-xl p-4 transition-colors",
        selected ? "bg-info-background border-info-bd" : backgroundColor
      )}
    >
      {(withRadio || title) && (
        <CardHeader className="pl-0 pb-2" onClick={onSelect}>
          <div className="flex items-center gap-2">
            {withRadio && radioValue && (
              <RadioGroupItem value={radioValue} id={radioValue} />
            )}
            {title && (
              <Label
                htmlFor={radioValue}
                className="font-semibold text-primary text-lg cursor-pointer"
              >
                {title}
              </Label>
            )}
          </div>
          <div className="pl-6 font-normal text-sm">
            <span className="text-primary-gray font-normal">{subTitle}</span>
            <span className="text-black"> {subTitleInfo}</span>
          </div>
        </CardHeader>
      )}

      {(withRadio || title) && <Separator />}

      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
