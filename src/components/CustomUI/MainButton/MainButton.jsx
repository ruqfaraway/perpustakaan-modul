import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const MainButton = ({
  type = "primary",
  children,
  onClick,
  disabled,
  loading,
  htmlType = null,
  className,
}) => {
  return (
    <Button
      variant={type === "primary" ? "" : type}
      onClick={onClick}
      disabled={disabled || loading}
      htmltype={htmlType}
      className={`${className} flex items-center justify-center gap-2 cursor-pointer  rounded-md text-sm font-medium px-2 py-2`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default MainButton;
