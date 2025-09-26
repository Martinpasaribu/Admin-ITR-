/* eslint-disable @typescript-eslint/no-explicit-any */
import { Facility } from "@/app/facility/models";
import http from "@/utils/http";
import { Room } from "../models";


/**
 * Tambah 1 gambar ke gallery (field: images[])
 */
export async function addFacilityGalleryImage(code: string, file: File): Promise<Room> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post(`/room/${code}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
}

/**
 * Hapus 1 gambar dari gallery
 */
export async function deleteFacilityGalleryImage(code: string, images: string) {
  const res = await http.delete(`/room/${code}/del/images`, {
    data: { images }, // axios delete bisa kirim body lewat "data"
  });

  return res.data.data; // samain struktur return seperti fungsi lain
}

export async function AddRoom(code: string, price : number, facility: any[] ) {
  try {
  const res = await http.post(`/room`, 
  { 
    code, price, facility 
  }
  );
    return res.data.data;
  } catch (error: any) {
    // Kalau pakai axios, biasanya response error ada di error.response.data
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal update customer";

    // Lempar error biar ditangkap di handleSubmit
    throw new Error(message);
  }
}


export async function updateFacilityImage(
  roomCode: string,
  facilityId: string,
  file: File
): Promise<Room> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await http.post(`/room/${roomCode}/facility/${facilityId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data; // asumsi backend balikin Room terupdate
}

export async function deleteFacilityImage(
  roomCode: string,
  facilityId: string
): Promise<Room> {
  const res = await http.delete(`/room/${roomCode}/facility/${facilityId}/image`);
  return res.data.data;
}