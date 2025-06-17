import { Control } from "react-hook-form";

import CommonFormComponent from "@/components/common/Form";
import { Card } from "@/components/ui/card";
import translator from "@/i18n/translator";

import { reKycFormSchema } from "../utils";

interface ReKYCDetailsFormFields {
  [key: string]: string;
}

interface IReKYCDetailsFormProps {
  reKYCDetailsFormControl: Control<ReKYCDetailsFormFields>;
}

const ReKYCDetailsForm = (props: IReKYCDetailsFormProps) => {
  const { reKYCDetailsFormControl } = props;
  return (
    <Card className="p-5 mb-4">
      <h3 className="font-bold">{translator("reKyc.reKycDetails")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reKycFormSchema.map((field) => (
          <CommonFormComponent
            key={field.value}
            field={field}
            control={reKYCDetailsFormControl}
          />
        ))}
      </div>
    </Card>
  );
};

export default ReKYCDetailsForm;
