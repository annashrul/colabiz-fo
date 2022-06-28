


import React from 'react';
import { useToasts } from 'react-toast-notifications'

import {iBankPt} from 'lib/interface'
import CardBank from 'components/payment/CardBank';

interface iCards {
    dataBank:Array<iBankPt>;
    handleClick:(datum:iBankPt)=>void;
    goBack:(val:number)=>void;

}
const Cards: React.FC<iCards> = ({dataBank,handleClick,goBack}) => {
    const [bank,setBank]=React.useState('-');
    const { addToast } = useToasts();

    const doClick=(bank:string)=>{
        if(bank!=="-"){
            for (var i=0; i < dataBank.length; i++) {
                if (dataBank[i].id === bank) {
                    handleClick(dataBank[i]);
                }
            }
        }else{
            addToast("Pilih bank terlebih dahulu!", {appearance: 'warning',autoDismiss: true});
        }
    }
    return (
        <>
            <div className="h-auto mt-16  flex lg:w-m-96 justify-center items-center mb-20">
                <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-24">
                    <div className="py-8 px-8">
                        <div className="grid grid-cols-1 gap-4 w-full">
                            {
                                dataBank?.map((item:iBankPt,i:number)=>{
                                return (
                                    <CardBank 
                                        key={i}
                                        selected={bank===item.id}
                                        id={item.id}
                                        title={item.bank_name}
                                        acc_name={item.acc_name}
                                        acc_no={item.acc_no}
                                        logo={item.logo}
                                        handleClick={(id:string)=>setBank(id)}
                                    />
                                )
                                })
                            }
                        </div>
                        <button onClick={(event)=>{event.preventDefault();goBack(1);}} className="w-full md:w-1/2 bg-base-red-600 0 hover:bg-base-red-700 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Kembali
                        </button>
                        <button onClick={(event)=>{event.preventDefault();doClick(bank);}} className="w-full md:w-1/2 bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Lanjut
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cards;
