// services/roomService.ts

import http from "@/utils/http";

export async function getRoomCodes() {
  const res = await http.get("/room/code-room"); // endpoint backend kamu
  return res.data.data; // sesuai struktur res backend
}
