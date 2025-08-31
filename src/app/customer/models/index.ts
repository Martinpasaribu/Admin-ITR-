import { Room } from "@/app/room/models";

export interface Facility {
  name: string;
  code: string;
  status: "B" | "R" | "T" | "P";
}


export interface Customer {
  _id: string;
  // user_id: ReactNode;
  // user_id: string;
  user_id:string;
  username: string;
  nik: number | 0;
  password: string;
  email: string;
  phone: number;
  role: string;
  checkIn: string;
  bill_status: "lunas" | "belum_lunas" | "pembayaran";
  room_key:  Room 
  booking_status: "M" | "K" | "P" |"AK";
}

export interface CustomerClient {
  // _id: string;
  user_id:string;
  username: string;
  nik: number | 0;
  password: string;
  email: string;
  phone: number;
  role: string;
  checkIn: string;
  bill_status: "lunas" | "belum_lunas" | "pembayaran";
  room_key:  string | number | readonly string[] | string [];
  booking_status: "M" | "K" | "P" | "AK";
}
