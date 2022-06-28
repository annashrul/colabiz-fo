import React,{useState} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import Api from 'lib/httpService'
import {iPaket, iOpt, iBankPt, iConfigWallet} from 'lib/interface'
import Helper from 'lib/helper'
import Nominal from 'components/deposit/nominal';
import ListBank from 'components/deposit/ListBank';
import Preview from 'components/deposit/preview';
import Modal from 'components/pin'
import { handleGet, handlePost } from 'lib/handleAction';
import { Alert } from '@windmill/react-ui'

interface iInvoice{
    category: Array<iOpt>;
    options: Array<iOpt>;
    total_tiket:number;
    dataBank?:Array<iBankPt>;
    config:iConfigWallet;
}

const Invoice: React.FC<iInvoice> =({dataBank,config})=> {
    const { addToast } = useToasts();
    const router = useRouter();
    const min_nominal=50;
    const [step,setStep]=useState(1);
    const [nominal,setNominal]=useState(0);
    const [bank,setBank]=useState<iBankPt>();
    const [openPin,setOpenPin]=useState(false);

    const doNominal=(nominal:number)=>{
        if(nominal===0) addToast("Nominal tidak boleh kosong!", {appearance: 'warning',autoDismiss: true});
        else if(nominal<min_nominal) addToast(`Minimal deposit adalah ${Helper.numFormat(`${min_nominal}`)}`, {appearance: 'warning',autoDismiss: true});
        else{
            setNominal(nominal)
            setStep(step+1);
        }
    }

    const getBank=(datum:iBankPt)=>{
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
            id_bank_destination:bank?.id,
            amount:nominal
        }
        await handlePost(Api.apiClient+'transaction/deposit', checkoutData,(datum)=>{
            Helper.mySwalWithCallback(datum.msg,()=>{
                setOpenPin(false);
                router.push(`/invoice/${btoa(datum.result.kd_trx)}`);
            });
            
        })
        
    }


    return (
        <Layout title="Deposit Poin Wallet">
            <div className="container mt-6 lg:px-6 md:px-3">
                <div className="flex justify-between">
                    <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                        Deposit Poin Wallet
                    </h2>
                </div>
            </div>
            <Modal 
                open={openPin}
                closeModal={()=>setOpenPin(false)}
                callBack={(val)=>doCheckout(val)}
            />
            <div className="mx-4 p-4 mt-4 mb-5">
                <div className="flex items-center">
                    <div className="flex items-center relative">
                        <div className={"rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-old-gold-600 "+(step===1?"bg-old-gold-600 text-white":"text-old-gold-600 ")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"  fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor" >
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
                            clipRule="evenodd"
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
            <div className={!config.isActive_dp?"flex flex-col items-center":"hidden"}>
                <Alert type="warning">Deposit hanya dapat dilakukan pada hari {config.schedule_dp} dari pukul {config.schedule_time_dp}.</Alert>
            </div>
            <div className={config.trx_dp!=='-'?"flex flex-col items-center mt-3":"hidden"}>
                <Alert type="info">Masih ada transaksi aktif, silahkan selesaikan transaksi sebelumnya <button className="bg-old-gold-700 hover:bg-old-gold-800 px-2 py-1" onClick={()=>router.push(`/invoice/${btoa(config.trx_dp)}`)}>Selesaikan</button></Alert>
            </div>

            {
                step===1?(
                    <Nominal
                        isActive={config.isActive_dp}
                        min_nominal={min_nominal}
                        handleClick={(nominal)=>doNominal(nominal)}
                    />
                    
                ):step===2?(
                    <ListBank dataBank={(dataBank as Array<iBankPt>)} handleClick={(datum:iBankPt)=>getBank(datum)} goBack={(val:number)=>doStep(val)}/>
                ):(
                    <Preview
                        bank={bank?.bank_name}
                        atas_nama={bank?.acc_name}
                        nominal={`${nominal}`}
                        admin="0"
                        total={`${nominal*10000}`}
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
        return {redirect: {destination: '/auth/login',permanent: false}}
    }else{
        Api.axios.defaults.headers.common["Authorization"] = Helper.decode(cookies._prowara);
    }
    // manipulate PAKET
    let kate:any=[];
    let total_tiket=0;
    const options: iOpt[] =[];
    await handleGet(Api.apiUrl+"category/membership",(datum)=>{
        kate=datum.data;
        total_tiket=datum.total_tiket;
    },false)
    if(kate.length>0){
        kate.map((item: iPaket)=>{
            return options.push({
                value: item.id,
                label: item.title
            })
        })
    }
    // END PAKET

    // GET BANK DATA
    let dataBank:any=[];
    await handleGet(Api.apiUrl+"bank?perpage=20",(datum)=>{
        dataBank=datum.data;
    },false)

    // Get Config
    let config:any;
    await handleGet(Api.apiUrl+"transaction/wallet/config",(datum)=>{
        config=datum;
    },false)

    return { 
        props:{
            kategori:kate,
            total_tiket,
            options,
            dataBank,
            config
        }
    }
}

export default Invoice;
