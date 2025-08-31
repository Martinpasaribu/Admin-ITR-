/* eslint-disable @typescript-eslint/no-explicit-any */
// services/report.ts
import http from "@/utils/http";

// Ambil semua report
export async function getReport() {
  const res = await http.get("/report");
  return res.data.data;
}

// Ambil detail report by ID
export async function getReportById(id: string) {
  const res = await http.get(`/report/${id}`);
  return res.data.data;
}

// Buat report baru
export async function createReport(payload: any) {
  const res = await http.post("/report", payload);
  return res.data;
}

// Update report
export async function updateReport(id: string, payload: any) {
  const res = await http.put(`/report/${id}`, payload);
  return res.data;
}

// Hapus report
export async function deleteReport(id: string) {
  const res = await http.delete(`/report/${id}`);
  return res.data;
}


export async function DeletedReport(_id: string) {
  try {
  const res = await http.delete(`/report/${_id}`);
    return res.data;
  } catch (error: any) {
    // Kalau pakai axios, biasanya response error ada di error.response.data
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal deleted report";

    // Lempar error biar ditangkap di handleSubmit
    throw new Error(message);
  }
}