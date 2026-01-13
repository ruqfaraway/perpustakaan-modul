"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

export function MultiSelect({ control, name, label, options }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto min-h-[40px] p-2"
                >
                  <div className="flex flex-wrap gap-1">
                    {field.value?.length > 0 ? (
                      options
                        .filter((opt) => field.value.includes(opt.id))
                        .map((opt) => (
                          <Badge key={opt.id} variant="secondary">
                            {opt.name}
                          </Badge>
                        ))
                    ) : (
                      <span className="text-muted-foreground">
                        Pilih role...
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder={`Cari ${label?.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.id}
                        onSelect={() => {
                          const newValue = field.value.includes(opt.id)
                            ? field.value.filter((id) => id !== opt.id)
                            : [...(field.value || []), opt.id];
                          field.onChange(newValue);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.includes(opt.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {opt.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
