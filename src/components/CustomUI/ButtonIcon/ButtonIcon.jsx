import { Button } from "@/components/ui/button";
import { AiFillCloseCircle } from "react-icons/ai";

export default function ButtonIcon({
  onClick = () => {},
  icon = <AiFillCloseCircle className="h-4 w-4" />,
  text,
  ...props
}) {
  return (
    <Button
      className="cursor-pointer"
      variant="outline"
      size="icon"
      onClick={onClick}
      {...props}
    >
      <span className="flex gap-2 justify-center items-center">
        {icon} {text}
      </span>
    </Button>
  );
}
