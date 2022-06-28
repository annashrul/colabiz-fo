import React,{useState,useEffect} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import Api from 'lib/httpService'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import { Alert } from '@windmill/react-ui'

import {iBankMember,iConfigWallet} from 'lib/interface'
import Helper from 'lib/helper'
import ListBank from 'components/withdrawal/listBank';
import Preview from 'components/withdrawal/preview';
import Modal from 'components/pin'
import { handleGet, handlePost } from 'lib/handleAction';

interface iTrxWithdrawal{
    dataBank?:Array<iBankMember>;
    config:iConfigWallet
}

const Withdrawal: React.FC<iTrxWithdrawal> =({dataBank,config})=> {

    const { addToast } = useToasts();
    const router = useRouter();
    const min_nominal:number=parseFloat(config.wd_min);
    const [step,setStep]=useState(1);
    const [oldPoin,setOldPoin] = React.useState(0)
    const [poin,setPoin] = React.useState(0)
    const [bank,setBank]=useState<iBankMember>();
    const [openPin,setOpenPin]=useState(false);
     useEffect(() => {
        setOldPoin(parseFloat(config.saldo));
    }, []);
    const handleCheck=()=>{
        if(poin===0) addToast("poin tidak boleh kosong!", {appearance: 'warning',autoDismiss: true});
        else if(poin<min_nominal) addToast(`Minimal deposit adalah ${Helper.numFormat(`${min_nominal}`)}`, {appearance: 'warning',autoDismiss: true});
         else if (oldPoin<poin){
            addToast("Poin kamu tidak mencukupi!", {appearance: 'warning',autoDismiss: true});
        }else{
            setPoin(poin)
            setStep(step+1);
        }
    }

    const getBank=(datum:iBankMember)=>{
        setBank(datum)
        setStep(step+1);
    }

    const doStep=(step:number)=>{
        setStep(step);
    }

    const doVerif=()=>{
        setOpenPin(true);
    }

    const doCheckout= async (pin:string)=>{
        const checkoutData={
            member_pin:pin,
            id_bank:bank?.id,
            amount:poin
          }
          await handlePost(Api.apiClient+'transaction/withdrawal', checkoutData,(datum)=>{
            Helper.mySwalWithCallback(datum.msg,()=>{
                router.push('/')
            });
          })
      
  }

  const handleOldPoin=()=>{
      setPoin(oldPoin);
  }



    return (
        <Layout title="Deposit Poin Wallet">
            <div className="container mt-6 lg:px-6 md:px-3">
                <div className="flex justify-between">
                    <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                        Penarikan Poin Wallet
                    </h2>
                </div>
            </div>
            <Modal 
                open={openPin}
                closeModal={()=>setOpenPin(false)}
                callBack={(val)=>doCheckout(val)}
            />
            <div className="mx-4 p-4 mt-4 mb-6">
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
            
            <div className={!config.isActive_wd?"flex flex-col items-center":"hidden"}>
                <Alert type="warning">Penarikan Poin Wallet hanya dapat dilakukan pada hari {config.schedule_wd} dari pukul {config.schedule_time_wd}.</Alert>
            </div>
            <div className={parseFloat(config.trx_wd)!==0?"flex flex-col items-center mt-3":"hidden"}>
                <Alert type="info">Masih ada penarikan Poin Wallet dalam antrian. Silahkan tunggu konfirmasi dari admin.</Alert>
            </div>
            {
                step===1?(
                    <div className="h-auto mt-16 w-full flex flex-row md:flex-col justify-center items-center mb-20">
                        <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-24">
                            <div className="py-8 px-8">
                                <div className="rounded shadow border p-6 w-full">
                                    
                                    <p className="text-gray-200 text-sm text-center">Poin Wallet saat ini</p>
                                    <p className="text-gray-200 text-3xl text-center">{Helper.numFormat(`${oldPoin}`)}</p>
                                    <button onClick={(event)=>{
                                        event.preventDefault();
                                        handleOldPoin();
                                    }} className="w-full  text-gray-700 dark:text-gray-200 px-8 py-2 mt-2 border border-gray-600 hover:bg-gray-600">
                                        Tarik semua Poin Wallet
                                    </button>
                                </div>
                                <h6 className="mt-8 text-yellow-400 text-sm">Poin Wallet:</h6>
                                <input 
                                    type="number" 
                                    className="pb-2 pt-3 w-full text-center focus:outline-none border-b-4 border-dashed border-old-gold text-3xl  bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200  p-8" 
                                    autoFocus 
                                    onChange={(event)=>setPoin(parseFloat((event.target.value).replace(/^0+/, '')))}
                                    value={poin}
                                    />
                                <h6 className="text-yellow-400  italic text-sm mt-2">Minimal Penarikan: {Helper.numFormat(`${min_nominal}`)}</h6>
                                {
                                    config.isActive_wd && parseFloat(config.trx_wd)===0?
                                    <button onClick={(event)=>{event.preventDefault();handleCheck();}} className="w-full bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                                        Lanjut
                                    </button>
                                    :
                                    <button className="w-full bg-gray-400 cursor-not-allowed hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                                        Lanjut
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    
                ):step===2?(
                    <ListBank dataBank={(dataBank as Array<iBankMember>)} handleClick={(datum:iBankMember)=>getBank(datum)} goBack={(val:number)=>doStep(val)}/>
                ):(
                    <Preview
                        bank={bank?.bank_name}
                        atas_nama={bank?.acc_name}
                        nominal={`${poin}`}
                        admin={poin*(parseFloat(config.wd_charge)/100)}
                        total={poin-(poin*(parseFloat(config.wd_charge)/100))}
                        handleClick={doVerif}
                        goBack={(val:number)=>doStep(val)}
                    />
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

    // GET BANK DATA
    let dataBank=[];
    try {
        const getBank = await Api.get(Api.apiUrl+"bank_member?perpage=20")
        if(getBank.status===200){
            dataBank=getBank.data.result.data;
        
        }else{
            dataBank=[];
        }
    } catch (err) {
        console.log("CONSOLE",err);
    }

    // Get Config
    let config:any;
    await handleGet(Api.apiUrl+"transaction/wallet/config",(datum)=>{
        config=datum;
    },false)
    return { 
        props:{
            dataBank,
            config
        }
    }
}

export default Withdrawal;
