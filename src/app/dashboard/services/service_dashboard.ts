
import { Facility } from "@/app/facility/models";
import http from "@/utils/http";
import { Dashboard } from "../models";

export async function getDashboardInfo(): Promise<Dashboard> {
  const res = await http.get("/dashboard");
  return res.data.data; // sesuaikan sama struktur response backend
}

