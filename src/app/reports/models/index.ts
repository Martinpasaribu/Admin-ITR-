export interface Room {
  _id: string;
  code: string;
  floor?: number;
  username: string
}

export interface Customer {
  _id: string;
  username: string
  room_key?: string | Room; // bisa ObjectId (string) atau populated Room
}

export interface Report {
  _id: string | null | undefined;
  customer_key?:  Customer; // bisa ObjectId (string) atau populated Customer
  report_type: "FK" | "FU" | "K";
  broken_type: "SP" | "R" | "SR";
  progress: "A" | "P" | "S" | "T";
  complain_des: string;
  broken_des: string;
  status: boolean;
  admin_note: string;
  image: string;
  totalPrice?: number;
  createdAt?: string | Date;
}
