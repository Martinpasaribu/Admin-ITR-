export const Progress = (status: string) => {

  switch (status) {
    case "A":
      return {
        label: "Antrian",
        className: "bg-gray-100 text-gray-700",
      };
    case "P":
      return {
        label: "Sedang Diproses",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "S":
      return {
        label: "Selesai",
        className: "bg-green-100 text-green-700",
      };
    case "T":
      return {
        label: "Ditolak",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export const TypeBroken = (status: string) => {

  switch (status) {
    case "FK":
      return {
        label: "Fasiltas Kamar",
      };
    case "FU":
      return {
        label: "Fasilitas Umum",
      };
    case "K":
      return {
        label: "Komplain",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
      };
  }
};

export const StatusBroken = (status: string) => {


  switch (status) {

    case "SP":
      return {
        label: "Sedikit Perbaikan",
      };
    case "R":
      return {
        label: "Rusak",
      };
    case "SR":
      return {
        label: "Sangat Rusak",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
      };
  }
};