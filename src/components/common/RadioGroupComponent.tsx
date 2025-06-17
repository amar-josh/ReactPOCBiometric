import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface IRadioGroupComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const RadioGroupComponent = ({
  value,
  onChange,
  options,
}: IRadioGroupComponentProps) => {
  return (
    <RadioGroup value={value} className="flex gap-6" onValueChange={onChange}>
      {options.map((option) => {
        return (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label className="cursor-pointer" htmlFor={option.value}>
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default RadioGroupComponent;

// Example to use inside form
{
  /* <FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <FormControl>
        <RadioGroupComponent
          value={field.value}
          onChange={field.onChange}
          options={[
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
            { label: "Guest", value: "guest" },
          ]}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>; */
}

// Example to use outside form
{
  /* <RadioGroupComponent
  value={role}
  onChange={(val) => setRole(val)}
  options={[
    { label: "value 1", value: "value 1" },
    { label: "value 2", value: "value 2" },
    { label: "value 3", value: "value 3" },
  ]}
/> */
}
