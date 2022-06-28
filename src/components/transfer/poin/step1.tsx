


import React from 'react';
import Nomine from 'components/Common/nominal'
import Helper from 'lib/helper'

interface iStep1 {
    handleClick:(nominal:number,userId:string)=>void;
    min_nominal:number;
}
const Step1: React.FC<iStep1> = ({handleClick,min_nominal}) => {
    const [poin,setPoin] = React.useState(0)
    const [id,setId] = React.useState('')
    const cbPoin=(num:string)=>{
        setPoin(parseFloat(num));
    }
    const nominalPoin=['50','100','200','250','300','500']
    return (
        <>
            <div className="h-auto mt-16 w-full flex flex-row md:flex-col justify-center items-center mb-20">
                <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  md:mx-24">
                    <div className="py-8 px-8">
                        <div className="grid grid-cols-2 gap-4">
                            {
                                nominalPoin.map((item,key)=>{
                                    return <Nomine key={key} selected={poin===parseFloat(item)} Poin={item} cb={cbPoin} />

                                })
                            }
                        </div>
                        <h6 className="mt-8 text-yellow-400 text-sm">Poin:</h6>
                        <input 
                            type="number" 
                            className="pb-2 pt-3 w-full text-center focus:outline-none border-b-4 border-dashed border-old-gold text-3xl  bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200  p-8" 
                            autoFocus 
                            onChange={(event)=>setPoin(parseFloat((event.target.value).replace(/^0+/, '')))}
                            value={poin}
                            />
                        <h6 className="text-yellow-400  italic text-sm mt-2">Minimal Transfer: {Helper.numFormat(`${min_nominal}`)}</h6>
                        <h6 className="mt-8 text-yellow-400 text-sm">User ID:</h6>
                        <input 
                            type="text" 
                            className="pb-2 pt-3 w-full text-center focus:outline-none border-b-4 border-solid border-old-gold text-3xl  bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200  p-8" 
                            autoFocus 
                            onChange={(event)=>setId(event.target.value)}
                            value={id}
                            />
                        <h6 className="text-yellow-400  italic text-sm mt-2">User ID Penerima bisa dilihat melalui profil penerima yang akan di transfer</h6>

                        <button onClick={(event)=>{event.preventDefault();handleClick(poin,id);}} className="w-full bg-old-gold hover:bg-old-gold-600 text-gray-700 dark:text-gray-200 px-8 py-4 mt-8">
                            Lanjut
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Step1;
