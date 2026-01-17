import { differenceInDays, startOfDay } from "date-fns";

export function calculateFine(dueDate) {
  const TARIF_DENDA = 1000; // Contoh: Rp 2.000 per hari
  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));

  // Hitung selisih hari
  const lateDays = differenceInDays(today, due);

  // Jika lateDays positif, berarti telat. Jika negatif/nol, tidak denda.
  const amount = lateDays > 0 ? lateDays * TARIF_DENDA : 0;

  return {
    lateDays: lateDays > 0 ? lateDays : 0,
    amount: amount,
  };
}
