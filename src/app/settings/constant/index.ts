export const StatusAdmin = (status: string) => {

  switch (status) {
    case "A":
      return {
        label: "Admin Biasa",
        className: "bg-cyan-100 text-cyan-700",
      };
    case "CA":
      return {
        label: "CO Admin",
        className: "bg-purple-100 text-purple-700",
      };
    case "SA":
      return {
        label: "Super Admin",
        className: "bg-green-100 text-green-700",
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
    case "BL":
      return {
        label: "Bangunan Lainya",
      };
    case "M":
      return {
        label: "Mesin",
      };
    case "BK":
      return {
        label: "Bangunan Kantor",
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

    case "R":
      return {
        label: "Ringan",
      };
      
    case "S":
      return {
        label: "Sedang",
      };

    case "B":
      return {
        label: "Berat",
      };

    default:
      return {
        label: status, // fallback ke kode aslinya
      };
  }
};