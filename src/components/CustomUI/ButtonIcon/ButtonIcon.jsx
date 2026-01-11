import { Button } from "@/components/ui/button";
import { AiFillCloseCircle } from "react-icons/ai";

export default function ButtonIcon({
  onClick = () => {},
  icon = <AiFillCloseCircle className="h-4 w-4" />,
  text,
  className, // Tambahin props ini biar bisa custom style dari luar
  ...props
}) {
  return (
    <Button
      className={className}
      // Kalau ada text, jangan pakai size="icon"
      // Kalau cuma icon doang, baru pakai size="icon"
      size={text ? "default" : "icon"}
      variant="outline"
      onClick={onClick}
      {...props}
    >
      <div className="flex gap-2 justify-center items-center">
        {icon}
        {text && <span>{text}</span>}
      </div>
    </Button>
  );
}
