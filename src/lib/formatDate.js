import { format } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(date) {
  if (!date) return "-";
  return format(new Date(date), "dd MMM yyyy", { locale: id });
}