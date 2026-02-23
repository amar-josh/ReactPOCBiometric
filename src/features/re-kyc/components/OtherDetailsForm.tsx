import { Control } from "react-hook-form";

import CommonFormComponent from "@/components/common/Form";
import { Card } from "@/components/ui/card";
import { IFormDetailsSchema, ILabelValue } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

import { otherDetailsFormSchema } from "../utils";

interface ISelectOptions {
  [key: string]: ILabelValue[];
}

interface IOtherDetailsFormValues {
  [key: string]: string | number;
}

interface IOtherDetailsFormProps {
  selectOptions: ISelectOptions;
  otherDetailsFormControl: Control<IOtherDetailsFormValues>;
  isOtherDropdownDetailsError?: boolean;
}

const OtherDetailsForm = ({
  selectOptions,
  isOtherDropdownDetailsError,
  otherDetailsFormControl,
}: IOtherDetailsFormProps) => {
  return (
    <Card
      className={cn("p-5", { "border-danger": isOtherDropdownDetailsError })}
    >
      <h3 className="font-bold">{translator("reKyc.otherDetails")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
        {otherDetailsFormSchema?.map((field: IFormDetailsSchema) => {
          return (
            <CommonFormComponent
              key={field.value}
              field={field}
              isRequired
              control={otherDetailsFormControl}
              selectOptions={selectOptions}
            />
          );
        })}
      </div>
    </Card>
  );
};

export default OtherDetailsForm;
