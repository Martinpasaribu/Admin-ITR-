export interface Report {
  id: number;
  report_type: string,
  user_id: string;
  room_no: string;
  status: string;
  damage_type: string,
  damage_desc: string,
  admin_note: string;
}


export interface Dashboard {

  amountUser? : number,
  amountReport? : number,
  amountFacility? : number,
  amountRoom ?: number,
  amountBooking?: number,
                        

}