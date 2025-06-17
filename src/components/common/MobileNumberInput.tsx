import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IMobileNumberInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export default function MobileNumberInput({
  label,
  value = "",
  onChange,
  name = "mobile",
  error,
  disabled = false,
  required = false,
  placeholder,
}: IMobileNumberInputProps) {
  return (
    <div className="space-y-1 w-full max-w-sm">
      {label && (
        <Label htmlFor={name} className="text-sm text-muted-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "flex items-stretch border rounded-md bg-white overflow-hidden mb-2",
          error
            ? "border-red-500"
            : "border-input focus-within:border-primary focus-visible:ring-[2px]"
        )}
      >
        <span
          className={cn(
            "flex items-center px-3 text-sm bg-muted text-muted-foreground border-r border-border",
            error && "border-r-red-500"
          )}
        >
          +91
        </span>
        <Input
          id={name}
          name={name}
          type="tel"
          autoComplete="off"
          maxLength={10}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value.replace(/\D/g, ""))}
          className="border-0 focus-visible:ring-0"
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// Example to use inside form
{
  /* <Controller
  name="mobile"
  control={control}
  rules={{ required: true, minLength: 10 }}
  render={({ field, fieldState }) => (
    <MobileNumberInput
      {...field}
      error={fieldState.error?.message}
      required
    />
  )}
/> */
}

// Example to use outside form
{
  /* <MobileNumberInput
  value={mobile}
  onChange={setMobile}
  error={mobile.length > 0 && mobile.length < 10 ? "Enter valid number" : ""}
/>; */
}
