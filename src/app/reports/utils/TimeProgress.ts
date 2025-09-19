// utils/time.ts
export function CalculateProgressDuration(
  createdAt?: string | Date,
  progressEnd?: string | Date
): string {
  // Pastikan ada kedua tanggal
  if (!createdAt || !progressEnd) return "-";

  const start = new Date(createdAt).getTime();
  const end = new Date(progressEnd).getTime();

  if (isNaN(start) || isNaN(end)) return "-";
  if (end < start) return "-";

  const diff = end - start;

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  return `${days} hari ${hours} jam`;
}
