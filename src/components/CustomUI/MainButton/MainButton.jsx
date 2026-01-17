import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const MainButton = ({
  variant = "default",
  size = "sm",
  children,
  onClick,
  disabled,
  loading,
  type = "button",
  className,
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      size={size}
      disabled={disabled || loading}
      type={type}
      className={`${className} flex items-center justify-center gap-2 cursor-pointer rounded-md text-md font-semibold`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default MainButton;
