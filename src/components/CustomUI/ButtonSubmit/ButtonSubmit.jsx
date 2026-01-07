import { Button } from "@/components/ui/button";
import React from "react";

const ButtonSubmit = ({ children }) => {
  return (
    <Button type="submit" className="cursor-pointer">
      {children}
    </Button>
  );
};

export default ButtonSubmit;
