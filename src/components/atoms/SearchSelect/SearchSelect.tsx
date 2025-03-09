"use client";

import { useEffect, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SearchSelectProps } from "./types";


const SearchSelect = ({
  options,
  className,
  placeholder = "Select",
  onChange,
  value,
  contentClassName,
  emptyPlaceholder = "Nothing found"
}: SearchSelectProps) => {
  const [open, setOpen] = useState(true);

  const [selectedLabel, setSelectedLabels] = useState(value);

  const handleSelect = (currentLabel: string) => {
    const newValue = currentLabel === selectedLabel ? "" : currentLabel;
    setSelectedLabels(newValue);
    if (onChange) {
      onChange(newValue);
    }
    setOpen(false);
  };

  useEffect(() => {
    setSelectedLabels(value);
  }, [value]);

  return (
    <div className="space-y-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex py-2 w-full justify-between items-center gap-1 rounded-[41px] text-black border border-[#E2E2E2] placeholder:text-[#A7A7A7] px-6 text-base outline-none bg-transparent hover:scale-100 transition-none",
              className
            )}
          >
            <span>
              {selectedLabel || <p className="text-[#A7A7A7]">{placeholder}</p>}
            </span>
            <ChevronDown className="h-5 w-5" color="#A7A7A7" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "max-h-[30rem] min-w-[450px] w-full overflow-y-auto p-0",
            contentClassName
          )}
        >
          <Command>
            <CommandInput placeholder={placeholder} className="h-9" />
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            <CommandGroup>
              {(options ?? []).map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                >
                  <p className="font-normal">{option}</p>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedLabel === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchSelect;