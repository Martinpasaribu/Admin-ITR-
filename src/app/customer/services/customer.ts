/* eslint-disable @typescript-eslint/no-explicit-any */
// services/customerService.ts

import http from "@/utils/http";

export async function getCustomers() {
  const res = await http.get("/customers");
  return res.data.data;
}


export async function addCustomer(payload: any) {
  try {
  const res = await http.post("/management-customer", payload);
    return res.data;
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

export async function DeletedCustomer(_id: string, room_id: string) {
  try {
  const res = await http.delete(`/management-customer/${_id}/${room_id}`);
    return res.data;
  } catch (error: any) {
    // Kalau pakai axios, biasanya response error ada di error.response.data
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal deleted customer";

    // Lempar error biar ditangkap di handleSubmit
    throw new Error(message);
  }
}



export async function updateCustomer(id: string, payload: any) {
  try {
    const res = await http.put(`/management-customer/${id}`, payload);
    return res.data;
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


export async function updateStatusBooking(id: string, status: string) {
  const res = await http.patch(`/management-customer/status/${id}`, { status });
  return res.data.data; // balikin data updated
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
