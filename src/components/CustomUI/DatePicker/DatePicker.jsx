"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";

export function MainDatePicker({
  onChange = () => {},
  selectedValue = new Date(),
  dateFormat = "DD-MM-YYYY",
  ...props
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !selectedValue && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedValue ? (
              format(selectedValue, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={selectedValue}
          onSelect={onChange}
          fromYear={1950}
          toYear={2024}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
