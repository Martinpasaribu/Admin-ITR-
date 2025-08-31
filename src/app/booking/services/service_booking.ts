// src/services/order_service.ts
import http from "@/utils/http";
import { Booking } from "../models";

export async function GetBooking(): Promise<Booking[]> {
  const res = await http.get("/booking"); // tanpa body
  return res.data.data;
}

export async function UpdateBookingStatus(id: string, room_key:string, status: string) {
  try {
    const res = await http.patch(`booking/${id}/${room_key}`, { status });
    return res.data;
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw error;
  }
}
