import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  defaultValue?: string;
  onChange?: (val: ILabelValue | null) => void;
  value?: string | number | null;
  error?: boolean;
}

export function ComboBox({
  list,
  defaultValue,
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
            "w-full justify-between border-gray-300 hover:border-gray-300 hover:text-black text-black focus:border-gray-300",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        >
          <span className={cn("truncate")}>
            {list.find((item) => item.value === value)?.label ??
              "Select an option..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup>
            {list.map((item) => (
              <CommandItem
                key={item.value}
                value={item.label}
                onSelect={() => {
                  const isSame = value === item.value;
                  onChange?.(isSame ? null : item); // deselect if clicked again
                  setOpen(false);
                }}
              >
                {item.label}
                <Check
                  className={cn(
                    "ml-auto",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
