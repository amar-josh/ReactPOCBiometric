import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ILabelValue } from "@/features/re-kyc/types";
import { cn } from "@/lib/utils";

interface IComboBoxProps {
  list: ILabelValue[];
  onChange?: (val: ILabelValue | null) => void;
  value?: string | number | null;
  error?: boolean;
}

export function ComboBox({
  list,
  onChange,
  value,
  error = false,
}: IComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-9 border-input hover:border-gray-300 hover:text-black text-black focus:border-gray-300",
            { "border-red-500 focus-visible:ring-red-500": error }
          )}
        >
          <span className={cn({ "text-muted-foreground": !value })}>
            {list.find((item) => item.value === value)?.label ??
              "Select Occupation"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9 border-input" />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                onSelect={() => {
                  onChange?.(item);
                  setOpen(false);
                }}
              >
                {item.label}
                <Check
                  className={cn("ml-auto opacity-0", {
                    "opacity-100": value === item.value,
                  })}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
