export interface Room {
  _id: string;
  code: string;
  floor?: number;
  username: string
}

export interface duration {
  days: number,
  hour: number,
  text: string
}


export interface Customer {
  _id: string;
  username: string
  room_key?: string | Room; // bisa ObjectId (string) atau populated Room
}

export interface Report {
  _id: string | null | undefined;
  report_code: string;
  customer_key?:  Customer; // bisa ObjectId (string) atau populated Customer
  report_type: "FK" | "FU" | "K";
  broken_type: "SP" | "R" | "SR";
  progress: "A" | "P" | "S" | "T";
  progress_end: Date,
  duration: duration,
  complain_des: string;
  broken_des: string;
  status: boolean;
  admin_note: string;
  image: string;
  totalPrice?: number;
  createdAt?: string | Date;
}
