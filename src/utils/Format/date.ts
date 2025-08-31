export function FormatDateTime(isoString: string | Date) {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Ambil bagian tanggal
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // bulan 0-11
  const year = date.getFullYear();

  // Ambil bagian waktu
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
