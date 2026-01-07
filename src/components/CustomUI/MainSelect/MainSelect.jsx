import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const SelectComponent = ({
  options = [],
  field,
  placeholder = "Select something",
  label = "Select",
  type,
}) => {
  const { value } = field;
  return (
    <Select
      onValueChange={(data) =>
        type === "text" ? field.onChange(data) : field.onChange(Number(data))
      }
      value={String(value)}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.length > 0 &&
            options.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {String(option.label)}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
