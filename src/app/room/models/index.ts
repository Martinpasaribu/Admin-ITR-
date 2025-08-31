

export interface Facility {
  name: string;
  code: string;
  status: "B" | "P" | "R" | "T";
}

import { FacilityClient } from "@/app/facility/models";

export interface Facilitys {
  _id: string;
  name: string;
  code: string;
  status: "B" | "P" | "R" | "T";
  image: string
}



export interface Room {
    _id: string,
    name: string,
    code: string,
    price: number,
    facility: FacilityClient[],
    status: boolean,
    customer_key: string,
    report_id: string,
    images: string[];
}