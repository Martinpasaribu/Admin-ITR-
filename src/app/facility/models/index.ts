export interface Facility {
    name: string,
    code: string,
    qty: number,
    price: number,
    status: "B" | "P" | "T" | "R", 
    date_in: Date,
    date_repair: Date,
    price_repair: number,
    image: string
    image_IRepair: string; 
    images: string[]
}

export interface FacilityUpdate {
    name: string,
    code: string,
    qty: number,
    price: number,
    // status: "good" | "repair" | "broken",
    date_in: Date,
    date_repair: Date,
    price_repair: number,
    // image: string
}
