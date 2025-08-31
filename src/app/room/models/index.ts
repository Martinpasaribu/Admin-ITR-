

export interface Facility {
  name: string;
  code: string;
  status: "B" | "P" | "R" | "T";
}

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
    facility: Facility[],
    status: boolean,
    customer_key: string,
    report_id: string,
    images: string[];
}