"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldError } from "@/components/ui/field";

export function MultiComboBoxComponent({ control, name, label, options }) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => {
        const selectedValues = Array.isArray(value) ? value : [];

        const toggleSelection = (itemValue) => {
          const isSelected = selectedValues.includes(itemValue);
          const nextValue = isSelected
            ? selectedValues.filter((v) => v !== itemValue)
            : [...selectedValues, itemValue];

          onChange(nextValue);
        };

        return (
          <FormItem className="flex flex-col ">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between h-auto min-h-10",
                      !selectedValues.length && "text-muted-foreground",
                    )}
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedValues.length > 0
                        ? `${selectedValues.length} buku dipilih`
                        : "Pilih buku..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] min-w-[--radix-popover-trigger-width] p-0"
                align="start"
                sideOffset={4}
                side="bottom"
              >
                <Command className="w-full">
                  <CommandInput placeholder={`Cari ${label}...`} />
                  <CommandList className="max-h-75 overflow-y-auto">
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label} // Value untuk searching
                          onSelect={() => toggleSelection(option.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValues.includes(option.value)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedValues.map((val) => {
                const option = options.find((o) => o.value === val);
                if (!option) return null;
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {option.label}
                    <button
                      type="button" // WAJIB agar tidak men-submit form
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSelection(val);
                      }}
                      className="ml-1 rounded-full outline-none hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => toggleSelection(val)}
                      />
                    </button>
                  </Badge>
                );
              })}
            </div>
            <FormMessage />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FormItem>
        );
      }}
    />
  );
}
