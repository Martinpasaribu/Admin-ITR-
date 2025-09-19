/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/order_service.ts
import http from "@/utils/http";
import { Booking } from "../models";

export async function GetBooking(): Promise<Booking[]> {
  const res = await http.get("/booking"); // tanpa body
  return res.data.data;
}

export async function  UpdateBookingStatus(id: string, room_key:string, status: string) {
  try {
          const res = await http.patch(`booking/${id}/${room_key}`, { status });
    return res.data;
  } catch (error: any) {
    // Kalau pakai axios, biasanya response error ada di error.response.data
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal update booking";

    // Lempar error biar ditangkap di handleSubmit
    throw new Error(message);
  }
}

export async function DeletedBooking(_id: string) {
  try {
  const res = await http.delete(`/booking/${_id}`);
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
