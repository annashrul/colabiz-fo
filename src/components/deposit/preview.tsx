


import React from 'react';
import Helper from 'lib/helper'

interface iCards {
    handleClick:()=>void;
    goBack:(val:number)=>void;
    bank?:string;
    atas_nama?:string;
    nominal?:string;
    admin:string;
    total?:string;
}
const Cards: React.FC<iCards> = ({bank,atas_nama,nominal,admin,total,goBack,handleClick}) => {
  
    return (
        <>
            <div className="h-auto mt-16 w-full flex flex-col mb-20">
                <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-60">
                    <div className="py-8 px-8">
                        <div className="w-full">
                            <div className="flex border-b-2 border-gray-600 justify-between px-2 py-2">
                                <p className="flex text-gray-700 dark:text-gray-200">
                                    Bank Tujuan
                                </p>
                                <p className="text-old-gold font-bold">{bank}</p>
                            </div>
                            <div className="flex border-b-2 border-gray-600 justify-between px-2 py-2">
                                <p className="flex text-gray-700 dark:text-gray-200">
                                    Atas Nama
                                </p>
                                <p className="text-old-gold font-bold">{atas_nama}</p>
                            </div>
                            <div className="flex border-b-2 border-gray-600 justify-between px-2 py-2">
                                <p className="flex text-gray-700 dark:text-gray-200">
                                    Nominal Poin
                                </p>
                                <p className="text-old-gold font-bold">{Helper.numFormat(nominal?nominal:"0")}</p>
                            </div>
                            <div className="flex border-b-2 border-gray-600 justify-between px-2 py-2">
                                <p className="flex text-gray-700 dark:text-gray-200">
                                    Biaya Admin
                                </p>
                                <p className="text-old-gold font-bold">{admin}</p>
                            </div>
                            <div className="flex border-b-2 border-gray-600 justify-between px-2 py-2">
                                <p className="flex text-gray-700 dark:text-gray-200">
                                    Total Transfer
                                </p>
                                <p className="text-old-gold font-bold">{Helper.rupiahFormat(`${total}`)}</p>
                            </div>
                        </div>
                        <button onClick={(event)=>{event.preventDefault();goBack(2);}} className="w-full md:w-1/2 bg-base-red-600 hover:bg-base-red-700  text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Kembali
                        </button>
                        <button onClick={(event)=>{event.preventDefault();handleClick();}} className="w-full md:w-1/2 bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Verifikasi
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Cards;
