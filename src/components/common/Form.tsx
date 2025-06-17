import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import translator from "@/i18n/translator";
import { cn } from "@/lib/utils";

import { ComboBox } from "./ComboBox";

interface ILabelValue {
  label: string;
  value: number | string;
}

interface ICommonFromComponentProps {
  field: any;
  control: Control<
    {
      [x: string]: any;
    },
    unknown,
    {
      [x: string]: any;
    }
  >;
  selectOptions?: { [key: string]: ILabelValue[] };
  isDisabled?: boolean;
}

const CommonFormComponent = ({
  field,
  control,
  selectOptions,
  isDisabled = false,
}: ICommonFromComponentProps) => {
  const options = selectOptions?.[field.value] ?? [];

  return (
    <FormField
      key={field.value}
      control={control}
      name={field.value}
      render={({ field: formField, fieldState }) => (
        <FormItem className={field?.className ?? ""}>
          <FormLabel className="!text-primary-gray">
            {translator(field.label)}
          </FormLabel>
          <FormControl>
            {["text", "email", "number"].includes(field.type) ? (
              <Input
                {...formField}
                type={field.type}
                disabled={field.readOnly}
                autoComplete="off"
                className={cn(
                  {
                    "bg-gray-100 text-gray-500 cursor-not-allowed":
                      field.readOnly,
                  },
                  {
                    "border-red-500 focus-visible:ring-red-500":
                      fieldState.error,
                  }
                )}
              />
            ) : field.type === "textarea" ? (
              <Textarea
                {...formField}
                disabled={field.readOnly}
                className={cn(
                  "w-full max-h-fit border rounded-md resize-none",
                  {
                    "bg-gray-100 text-gray-500 cursor-not-allowed":
                      field.readOnly,
                  },
                  {
                    "border-red-500 focus-visible:ring-red-500":
                      fieldState.error,
                  }
                )}
              />
            ) : field.type === "select" ? (
              <Select
                onValueChange={(val) => {
                  const selectedOption = options.find(
                    (opt) => String(opt.value) === val
                  );
                  formField.onChange(selectedOption?.value);
                }}
                value={String(formField.value ?? "")}
                disabled={isDisabled}
              >
                <SelectTrigger
                  data-testid="select-trigger"
                  className={cn("w-full", {
                    "border-red-500 focus:ring-red-500": fieldState.error,
                  })}
                >
                  <SelectValue
                    placeholder={`Select ${translator(field.label)}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "combobox" ? (
              <ComboBox
                list={options}
                value={formField.value}
                onChange={(selectedItem) =>
                  formField.onChange(selectedItem?.value)
                }
                error={!!fieldState.error}
              />
            ) : null}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommonFormComponent;
