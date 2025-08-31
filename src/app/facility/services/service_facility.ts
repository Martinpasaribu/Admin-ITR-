import { Facility, FacilityUpdate } from "@/app/facility/models";
import http from "@/utils/http";

export async function getFacilities(): Promise<Facility[]> {
  const res = await http.get("/facility");
  return res.data.data; // sesuaikan sama struktur response backend
}

export async function addFacility(data: Facility) {
  const res = await http.post("/facility", data);
  return res.data.data;
}

export async function updateFacility(code: string, updatedData: FacilityUpdate) {
  return http.put(`/facility?code=${code}`, {
    data: updatedData, // 👈 bungkus ke data
  });
}

export async function updateFacilityStatus(code: string, status: string) {
  const res = await http.patch(`/facility/status/${code}`, { status });
  return res.data.data; // balikin data updated
}

/**
 * Update main image (field: image)
 */
export async function addFacilityImage(code: string, file: File): Promise<Facility> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post(`/facility/${code}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
}

export async function addFacilityImageIRepair(code: string, file: File): Promise<Facility> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post(`/facility/${code}/image_irepair`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
}

/**
 * Tambah 1 gambar ke gallery (field: images[])
 */
export async function addFacilityGalleryImage(code: string, file: File): Promise<Facility> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post(`/facility/${code}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
}

/**
 * Hapus 1 gambar dari gallery
 */
export async function deleteFacilityGalleryImage(code: string, images: string) {
  const res = await http.delete(`/facility/${code}/del/images`, {
    data: { images }, // axios delete bisa kirim body lewat "data"
  });

  return res.data.data; // samain struktur return seperti fungsi lain
}
