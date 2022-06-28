import React, { useState, useEffect} from "react";
import { useToasts } from 'react-toast-notifications'
import "react-intl-tel-input/dist/main.css";
import Layout from 'Layouts'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import {iWidget,iBankPt} from 'lib/interface';
import nookies from 'nookies'
import { NextPageContext } from 'next'
import { } from '@windmill/react-ui'
import { useRouter } from 'next/router'
import Modal from 'components/pin'
import CardBank from 'components/payment/CardBank';
import { handleGet, handlePost } from "lib/handleAction";

interface iOrderTiket {
    dataWidget:iWidget;
    dataBank:Array<iBankPt>;
}

const OrderTiket: React.FC<iOrderTiket> = ({dataWidget,dataBank}) =>{
    const { addToast } = useToasts();
    const router = useRouter();
    const [bank,setBank]=useState('-');
    const [step,setStep]=useState(1);
    const [qty,setQty] = React.useState(0);
    const [no,setNo] = React.useState(0);
    const [openPin,setOpenPin]=useState(false);
     useEffect(() => {
    }, []);
    
    const handleBack=()=>{
       setStep(step-1);
    }
    const handleNextStep=(param:string)=>{
        if(param==='param1'){
            if(qty<1||isNaN(qty)) return addToast("poin tidak boleh kosong!", {appearance: 'warning',autoDismiss: true});
            else{
                setQty(qty)
                setStep(step+1);
            }
        }
        else if(param==='param2'){
            if(bank==='-'){
                return addToast("Pilih bank terlebih dahulu!", {appearance: 'warning',autoDismiss: true});
            }
        }
        setStep(step+1);
     }

    const doVerif=()=>{
        setOpenPin(true);
    }

    const doCheckout= async (pin:string)=>{
        const checkoutData={
            qty:qty,
            member_pin:pin,
            id_bank_destination:bank,
            metode_pembayaran:bank==='saldo'?'saldo':'transfer'
        }
        await handlePost(Api.apiClient+'transaction/pin', checkoutData,(datum)=>{
            Helper.mySwalWithCallback(datum.msg,()=>{
                setOpenPin(true);
                bank==='saldo'?
                  router.push(`/`):
                  router.push(`/invoice/${btoa(datum.result)}`);
            })
        })
  }

    const handleBank=(i:number)=>{
        setNo(i);
    }
  


    return (
        <Layout title="Order Tiket Aktivasi">
            <div className="container mt-6 lg:px-6 md:px-3">
                <div className="flex justify-between">
                    <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                        Order Tiket Aktivasi
                    </h2>
                </div>
            </div>
            <Modal 
                open={openPin}
                closeModal={()=>setOpenPin(false)}
                callBack={(val)=>doCheckout(val)}
            />
            <div className="mx-4 p-4 mt-4">
                <div className="flex items-center">
                    <div className="flex items-center relative">
                        <div className={"rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-old-gold-600 "+(step===1?"bg-old-gold-600 text-white":"text-old-gold-600 ")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"  fill="none" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" >
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                        </div>
                        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-old-gold-600">Nominal</div>
                    </div>
                    {
                        step>1?<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-old-gold-600" />:<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300" />
                    }
                    <div className="flex items-center relative">
                        <div className={"rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-old-gold-600 "+(step===2?"bg-old-gold-600 text-white":"text-old-gold-600 ")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"   fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clip-rule="evenodd"
                        ></path>
                        </svg>
                        </div>
                        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-old-gold-600">Metode Pembayaran</div>
                    </div>
                    {
                        step===3?<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-old-gold-600" />:<div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300" />
                    }
                    <div className="flex items-center relative">
                        <div className={"rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-old-gold-600 "+(step===3?"bg-old-gold-600 text-white":"text-old-gold-600 ")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-database ">
                            <ellipse cx={12} cy={5} rx={9} ry={3} />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        </div>
                        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-old-gold-600">Konfirmasi</div>
                    </div>
                </div>
            </div>
            {
                step===1?(
                    <div className="h-auto mt-16 w-full flex flex-row md:flex-col justify-center items-center mb-20">
                        <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-24">
                            <div className="py-8 px-8">
                                <div className="rounded shadow border p-6 w-full">
                                    
                                    <p className="text-gray-200 text-sm text-center">Tiket saat ini:</p>
                                    <p className="text-gray-200 text-3xl text-center">{dataWidget.total_pin}</p>
                                    
                                </div>
                                <h6 className="mt-8 text-yellow-400 text-sm">qty:</h6>
                                <input 
                                    type="number" 
                                    className="pb-2 pt-3 w-full text-center focus:outline-none border-b-4 border-dashed border-old-gold text-3xl  bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200  p-8" 
                                    autoFocus 
                                    onChange={(event)=>setQty(parseFloat((event.target.value).replace(/^0+/, '')))}
                                    value={qty}
                                    />
                                <button onClick={(event)=>{event.preventDefault();handleNextStep('param1');}} className="w-full bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                                    Lanjut
                                </button>
                            </div>
                        </div>
                    </div>
                    
                ):step===2?(
                    <div className="h-auto mt-16 w-full flex flex-row md:flex-col justify-center items-center mb-20">
                        <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-24">
                            <div className="py-8 px-8">
                            <CardBank 
                              selected={bank==='saldo'}
                              id={'saldo'}
                              title="Saldo"
                              acc_name={`${Helper.numFormat(`${dataWidget.saldo}`)}`}
                              acc_no="Sisa Poin :"
                              logo="/wallet.webp"
                              handleClick={(id:string)=>setBank(id)}
                            />
                          {
                            dataBank?.map((item:iBankPt,i:number)=>{
                              return (
                                <CardBank 
                                  key={i}
                                  style={bank===item.id?"w-full border-4 border-old-gold":"w-full"}
                                  selected={bank===item.id}
                                  id={item.id}
                                  title={item.bank_name}
                                  acc_name={item.acc_name}
                                  acc_no={item.acc_no}
                                  logo={item.logo}
                                  handleClick={(id:string)=>{setBank(id);handleBank(i);}}
                                />

                              )
                            })
                          }
                        </div>
                        <button onClick={(event)=>{event.preventDefault();handleBack();}} className="w-full md:w-1/2 bg-base-red-600 0 hover:bg-base-red-700 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Kembali
                        </button>
                        <button onClick={(event)=>{event.preventDefault();handleNextStep('param2');}} className="w-full md:w-1/2 bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Lanjut
                        </button>
                        </div>
                    </div>
                   
                ):(
                    <div className="h-auto mt-16 w-full flex flex-col mb-20">
                        <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-60">
                            <div className="py-8 px-8">
                                <div className="w-full">
                                    <div className="flex justify-between px-2 py-2">
                                        <p className="flex text-gray-700 dark:text-gray-200">
                                            Metode Pembayaran
                                        </p>
                                        <p className="text-old-gold font-bold">{bank==='saldo'?'Saldo':'Transfer'}</p>
                                    </div>
                                    <div className="flex justify-between px-2 py-2">
                                        <p className="flex text-gray-700 dark:text-gray-200">
                                            Bank Tujuan
                                        </p>
                                        <p className="text-old-gold font-bold">{bank==='saldo'?'-':dataBank[no].bank_name}</p>
                                    </div>
                                    <div className="flex justify-between px-2 py-2">
                                        <p className="flex text-gray-700 dark:text-gray-200">
                                            Atas Nama
                                        </p>
                                        <p className="text-old-gold font-bold">{bank==='saldo'?'-':dataBank[no].acc_name}</p>
                                    </div>
                                    <div className="flex justify-between px-2 py-2">
                                        <p className="flex text-gray-700 dark:text-gray-200">
                                            Jumlah tiket
                                        </p>
                                        <p className="text-old-gold font-bold">{qty} Tiket</p>
                                    </div>
                                   
                                    <div className="flex justify-between px-2 py-2">
                                        <p className="flex text-gray-700 dark:text-gray-200">
                                            Jumlah Yang Harus Dibayar
                                        </p>
                                        <p className="text-old-gold font-bold">{Helper.numFormat(`${qty}`)}</p>
                                    </div>
                                </div>
                                <button onClick={(event)=>{event.preventDefault();handleBack();}} className="w-full md:w-1/2 bg-base-red-600 hover:bg-base-red-700  text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                                    Kembali
                                </button>
                                <button onClick={(event)=>{event.preventDefault();doVerif();}} className="w-full md:w-1/2 bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                                    Verifikasi
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            

        </Layout>
    );
}
export async function getServerSideProps(ctx:NextPageContext) {
    const cookies = nookies.get(ctx)
    if(!cookies._prowara){
        return {
          redirect: {
              destination: '/auth/login',
              permanent: false,
          },
        }
    }else{
        Api.axios.defaults.headers.common["Authorization"] = Helper.decode(cookies._prowara);
    }
    let dataWidget={};
    await handleGet(Api.apiUrl+"site/memberarea",(datum)=>{
        dataWidget=datum;
    },false)

    let dataBank:any=[];
    await handleGet(Api.apiUrl+"bank?perpage=20",(datum)=>{
        dataBank=datum.data;
    },false)

    return { 
        props:{dataWidget,dataBank}
    }
}

export default OrderTiket;