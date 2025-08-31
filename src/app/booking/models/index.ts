import { Room } from "@/app/room/models";

export interface Booking {
  _id: string;
  username: string;
  room_key: Room;
  phone: number;
  email: string;
  booking_date: Date;
  status:string;
}

