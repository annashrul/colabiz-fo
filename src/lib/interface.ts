export interface iUser { 
    id: string,
    foto: string,
    fullname: string,
    mobile_no: string,
    referral: string,
    status: number,
    created_at: string
}

export interface iPaket{
  id:string,
  title:string,
  price:string,
  category:string,
  gambar:string,
  caption:string,
  minimal_price:number,
  pin_required:number,
  profit_sharing:number,
  contract:number,
  total_poin:number
}

export interface iOpt{
  value:string,
  label:string,
}

export interface iBankPt{
  id: string;
  bank_name: string;
  logo: string;
  acc_name: string;
  acc_no: string;
  tf_code: string;
}

export interface iBankMember{
  id: string;
  id_member: string;
  bank_name: string;
  acc_name: string;
  acc_no: string;
}

export interface iBankData{
  id:string,
  name:string,
}

export interface iRegist{
    fullname: string;
    mobile_no:string;
    nik:string;
    sponsor:string;
    signup_source:string;
    id_paket:string;
    id_bank_destination:string;
    datumPaket:iPaket;
    typeSponsor:string;
    namaSponsor:string;
    bank:{
      id:string;
      bank_name:string;
      acc_name:string;
      acc_no:string;
    }
}

export interface iInvestment{
  id:string,
  kd_trx:string,
  fullname:string,
  trx_in:string,
  trx_out:string,
  note:string,
  created_at:string,
}

export interface iArrInvestment{
  total:number,
  per_page:number,
  offset:number,
  to:number,
  last_page:number,
  current_page:number,
  from:number,
  data:Array<iInvestment>
  summary:{
    trx_in:string,
    trx_out:string,
    saldo_awal:string,
  }

}

export interface iDeposit{
  id:string,
  kd_trx:string,
  id_member:string,
  fullname:string,
  id_bank_destination:string,
  bank_name:string,
  acc_name:string,
  acc_no:string,
  amount:string,
  unique_code:number,
  status:number,
  payment_slip:string,
  created_at:string,
}
export interface iNetwork{
  id:string,
  name:string,
  parentId:string,
  picture:string,
  hasChild:boolean,
  join_date:string,
  children:Array<iNetwork>;
  profiles:Array<iNetwork>,
}

export interface iWithdrawal{
  id:string,
  id_member:string,
  fullname:string,
  id_bank:string,
  bank_name:string,
  acc_name:string,
  acc_no:string,
  amount:string,
  charge:string,
  status:number,
  kd_trx:string,
  created_at:string,
}

export interface iTransaksi{
  id:string,
  kd_trx:string,
  fullname:string,
  trx_in:string,
  trx_out:string,
  note:string,
  created_at:string,
}
export interface iSlot{
  id: string;
  id_member:  string;
  fullname:  string;
  id_paket:  string;
  title:  string;
  slot_no: number;
  amount:  string;
  daily_earning:  string;
  contract: number;
  start_date: Date;
  status: number;
  created_at: Date;
  updated_at: Date;
  status_wd:number;
}

export interface iPagin{
    current_page:number;
    total:number;
    per_page:number;
    summary:{
      trx_in:number;
      trx_out:number;
      saldo_awal:number;
    }
}

export interface iWidget{
  total_pin: number;
  saldo: number;
  modal: number;
  sponsor: number;
  total_member:number;
}

export interface iMemberUid{
  id: string;
  fullname: string;
  referral: string;
  status: number;
  foto: string;
}


export interface iContent{
  id: string;
  title: string;
  id_category: string;
  category: string;
  caption: string;
  type_no: number;
  video: string;
  picture: string;
  created_at: string;
}

export interface iConfigWallet{
  wd_modal_charge: any;
  dp_min: string;
  tf_min: string;
  wd_min:string;
  isActive_wd: boolean;
  isActive_dp: boolean;
  saldo: string;
  tiket: string;
  trx_wd: string;
  trx_dp: string;
  schedule_dp: string;
  schedule_time_dp: string;
  schedule_wd: string;
  schedule_time_wd: string;
  wd_charge: string;
  tf_charge: string;
}

export interface iMutasiTiket{
  kode: string;
  fullname: string;
  jenis_transaksi:string;
  jumlah: string;
  note: number;
  created_at: string;
}


