export const StatusBooking = (status: string) => {

  switch (status) {

    case "P":
      return {
        label: "Di Pesanan",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "M":
      return {
        label: "Masuk",
        className: "bg-green-100 text-green-700",
      };
    case "AK":
      return {
        label: "Ajukan Keluar",
        className: "bg-gray-100 text-gray-700",
      };
    case "K":
      return {
        label: "Telah Keluar",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: "-", // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};