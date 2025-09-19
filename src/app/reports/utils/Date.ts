export function FormatDate(
  input?: Date | string | null,
  separator: string = "-"
): string | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return null;

  // pakai UTC; ganti ke getFullYear/getMonth/getDate kalau mau zona lokal
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${y}${separator}${m}${separator}${day}`;
}
