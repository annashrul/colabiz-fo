import React,{useState} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'
import Api from 'lib/httpService'
import {iConfigWallet, iMemberUid} from 'lib/interface'
import Helper from 'lib/helper'
import Modal from 'components/pin'
import Step1 from 'components/transfer/pin/step1';
import Step2 from 'components/transfer/pin/step2';
import { handleGet, handlePost } from 'lib/handleAction';

interface iTfTiket{
    config:iConfigWallet
}

const TransferTiket: React.FC<iTfTiket> =({config})=> {
    const { addToast } = useToasts();
    const router = useRouter();
    const min_nominal=0;
    const [step,setStep]=useState(1);
    const [nominal,setNominal]=useState(0);
    const [user,setUser]=useState<iMemberUid>();
    const [openPin,setOpenPin]=useState(false);

    const doNominal=(nominal:number,userId:string)=>{
        if(nominal===0||isNaN(nominal)) {
            addToast("Nominal tidak boleh kosong!", {appearance: 'warning',autoDismiss: true});
        }
        else if(nominal<min_nominal) {
            addToast(`Minimal deposit adalah ${Helper.numFormat(`${min_nominal}`)}`, {appearance: 'warning',autoDismiss: true});
        }
        else if(userId==='') {
            addToast(`User ID tidak boleh kosong!`, {appearance: 'warning',autoDismiss: true});
        }
        else{
            setNominal(nominal);
            checkMember(userId);
        }
           
    }


    const checkMember=async(userId:string)=>{
        await handleGet(Api.apiClient+`member/uid/${userId}`,(datum)=>{
            setUser(datum);
            setStep(step+1);
        });
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
            uid:user?.id,
            qty:nominal
        }
        await handlePost(Api.apiClient+'pin/transfer',checkoutData,(datum)=>{
            Helper.mySwalWithCallback(datum.msg,()=>{
                setOpenPin(false);
                router.push(`/`);
            });
        })
   
    }

    return (
        <Layout title="Transfer Tiket">
            <div className="container mt-6 lg:px-6 md:px-3">
                <div className="flex justify-between">
                    <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                        Transfer Tiket
                    </h2>
                    <div>
                        <div className="flex items-center justify-between mt-6 w-full p-2 lg:rounded-full md:rounded-full bg-white dark:bg-gray-700 dark:hover:bg-gray-800 border border-gray-700	 rounded-lg">
                            <div className="lg:flex md:flex items-center">
                                <div className="flex flex-col px-3">
                                    <div className="text-xs leading-3 text-gray-700 dark:text-gray-300 w-full">Tiket Anda Saat Ini :</div>
                                    <div className="text-sm leading-3 text-center text-gray-700 dark:text-gray-300 mt-2 font-bold w-full">{config.tiket}</div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-old-gold-600">Detail Transfer</div>
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
                    <Step1
                        min_nominal={min_nominal}
                        handleClick={(nominal,userId)=>doNominal(nominal,userId)}
                    />
                    
                ):step===2?(
                    <Step2
                        penerima={user?.fullname}
                        jumlah_transfer={`${nominal}`}
                        admin="0"
                        total_transfer={`${nominal}`}
                        handleClick={doVerif}
                        goBack={(val:number)=>doStep(val)}
                    />
                ):(
                    <div></div>
                )
            }

            

        </Layout>
    );
}

export async function getServerSideProps(ctx:NextPageContext) {
    Helper.handleRoute(ctx);
    let config: any = {};
    await handleGet(Api.apiUrl+"transaction/wallet/config", (res) => {
        config = res;
    }, false)

    return { 
        props:{config}
    }
}

export default TransferTiket;
