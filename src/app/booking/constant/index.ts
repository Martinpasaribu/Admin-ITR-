export const TypeStatus = (status: string) => {
  switch (status) {
    case "C":
      return {
        label: "Confirm",
        className: "bg-green-100 text-green-700",
      };
    case "P":
      return {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "CL":
      return {
        label: "Cancel",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: status, // fallback ke kode aslinya
        className: "bg-gray-100 text-gray-700",
      };
  }
};
