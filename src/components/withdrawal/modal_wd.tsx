import React, {useState,useEffect} from 'react'
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'
import {iBankMember,iConfigWallet} from 'lib/interface'
import Api from 'lib/httpService'
import Helper from 'lib/helper'
import ModalPin from 'components/pin'
import { handleGet, handlePost } from 'lib/handleAction';
import router from 'next/router';

interface iModalWD{
  open:boolean;
  closeModal:()=>void;
  amount:any,
  id_slot:any

}

const ModalWD: React.FC<iModalWD> = ({open,closeModal,amount,id_slot}) => {
    const [arrDatum,setArrDatum]= useState<Array<iBankMember>>([]);
    const [arrDatumConfig,setArrDatumConfig]= useState<iConfigWallet>();
    const [no,setNo]= useState(100);
    const [openPin,setOpenPin]=useState(false);
    const { addToast } = useToasts();


    useEffect(() => {
        loadBank();
        loadConfig();
    }, []); 

    const loadConfig=async()=>{
        await handleGet(Api.apiClient+"transaction/wallet/config",(datum)=>{
            setArrDatumConfig(datum);
        })
    }

    const loadBank=async()=>{
        try {
            const getBank = await Api.get(Api.apiClient+"bank_member?perpage=20")
            if(getBank.status===200){
                setArrDatum(getBank.data.result.data);
            }else{
                setArrDatum([]);
            }
        } catch (err) {
            console.log("CONSOLE",err); 
        }
    }
    const toggleModal=()=>{
        setNo(100)
        closeModal();
    }

    const handleNext=()=>{
        if(no===100){
            addToast("Pilih bank terlebih dahulu!", {appearance: 'warning',autoDismiss: true});
        }
        else{
            setOpenPin(true);
        }
    }
    const doCheckout=async(val:string)=>{
        // Helper.mySwalWithCallback('Pastikan data telah sesuai.',()=>{setOpenPin(true);})
        const data = {
            id_bank:arrDatum[no].id,
            amount:amount,
            member_pin:val,
            type:1,
            id_slot:id_slot
        }
        await handlePost(Api.apiClient+'transaction/withdrawal',data,(datum)=>{
            Helper.mySwalWithCallback(datum.msg,()=>{
                router.push("/");
                setOpenPin(false);
                toggleModal();
            })
        });
    }


    
  return (
    <>
        <ModalPin 
            open={openPin}
            closeModal={()=>setOpenPin(false)}
            callBack={(val)=>doCheckout(val)}
        />
      <Modal isOpen={open} onClose={toggleModal}>
            <ModalBody>
                <div className="w-full items-center justify-items-center p-0">
                    <div className="w-full flex flex-col items-center justify-items-center mb-6">
                        <img src="/logo.png" className="w-1/4"/>
                        <h3 className="text-center mt-3">Rincian Penarikan Modal</h3>
                    </div>
                    <table className="w-full whitespace-no-wrap">
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                            <tr>
                                <td>Modal</td>
                                <td>:</td>
                                <td>{Helper.numFormat(amount)}</td>
                            </tr>
                            <tr>
                                <td>Charge</td>
                                <td>:</td>
                                <td>{Helper.numFormat(`${parseFloat(amount)*(arrDatumConfig?.wd_modal_charge/100)}`)}</td>
                            </tr>
                            <tr>
                                <td>Total Penarikan</td>
                                <td>:</td>
                                <td>{Helper.numFormat(`${parseFloat(amount)-(parseFloat(amount)*(arrDatumConfig?.wd_modal_charge/100))}`)}</td>
                            </tr>
                           
                        </tbody>
                    </table>
                    <br/>
                    <hr/>
                    <br/>
                    <label className="transition-all">Pilih Bank</label>
                    <div className="grid grid-cols-1 gap-2">
                    {
                        arrDatum?.length>0?arrDatum.map((item:iBankMember,i:number)=>{
                            return(
                                <button
                                key={i}
                                onClick={(event)=>{event.preventDefault();setNo(i)}}
                                className={"relative block p-px overflow-hidden rounded shadow-sm hover:scale-105 group hover:shadow-xl focus:outline-none "+(i===no?"w-full border-4 border-old-gold":"w-full border-2 border-gray-400")}
                            >
                                <div className="relative flex items-start p-5 pb-8 bg-white dark:bg-gray-700 dark:hover:bg-gray-800 rounded-sm">
                                    <div className="lg:pr-4 w-2/3 text-left">
                                    <h6 className="mb-2 font-semibold leading-5  text-gray-600 dark:text-gray-400">
                                        {item.bank_name}
                                    </h6>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.acc_name}<br/>
                                        {item.acc_no}
                                    </p>
                                    </div>
                                    <div className="ml-10 mt-9">
                                    <svg
                                        className="w-3 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-deep-purple-accent-400"
                                        fill="currentColor"
                                        viewBox="0 0 12 12"
                                    >
                                        <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                                    </svg>
                                    </div>
                                </div>
                            </button>
                            
                            );
                        }):"no data"
                    }
                    </div>
                    
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className="w-full sm:w-auto" layout="outline" onClick={toggleModal}>
                    Batal
                </Button>
                <Button className="bg-old-gold hover:bg-old-gold-600 w-full sm:w-auto" onClick={handleNext}>Lanjut</Button>
            </ModalFooter>
      </Modal>
    </>
  )
}



export default ModalWD;