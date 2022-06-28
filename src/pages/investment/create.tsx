import React,{useEffect, useState} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import Select from 'react-select'
import { useToasts } from 'react-toast-notifications'
import { useRouter } from 'next/router'


import Api from 'lib/httpService'
import Card from 'components/investment/paket'
import {iPaket, iOpt} from 'lib/interface'

interface iInvoice{
  category: Array<iOpt>;
  options: Array<iOpt>;
  total_tiket:number;
}

const Invoice: React.FC<iInvoice> =({options,total_tiket})=> {
    const { addToast } = useToasts();
    const router = useRouter()

    const [datumPaket,setDatumPaket]= useState<Array<iPaket>>([]);
    const [paket,setPaket]= useState("");
    const [kategori,setKategori]= useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        // if(options!==undefined){
            handleCategory(options[0]?.value)
        // }
	}, [setKategori]);

    const handleCategory= async (val:string)=>{
        setLoading(true)
        setKategori(val);

        try {
        const getPaket=await Api.get(Api.apiClient+`paket?perpage=100&category=${val}`)
            setTimeout(
            function () {
                setLoading(false)

                // save token to localStorage
                if(getPaket.data.status==='success'){
                    const datum = getPaket.data.result;
                    setDatumPaket(datum.data);
                }else{
                    addToast("Kesalahan pada server.", {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                }
            },800)
        
        } catch (err) {
        setTimeout(
            function () {
                setLoading(false)

                // save token to localStorage
                if (err.message === 'Network Error') {
                    addToast("Tidak dapat tersambung ke server!", {
                    appearance: 'error',
                    autoDismiss: true,
                    })
                    
                }else{
                    if(err.response.data.msg!==undefined){
                    addToast(err.response.data.msg, {
                        appearance: 'error',
                        autoDismiss: true,
                        })
                    }else{
                    addToast("Kesalahan pada server.", {
                        appearance: 'error',
                        autoDismiss: true,
                        })
                    }
        
                }
            },800)

        }
    }

    const handleCheckout=()=>{
        let tiket_required=0;
        for (var i=0; i < datumPaket?.length; i++) {
            if (datumPaket[i].id === paket) {
                tiket_required=datumPaket[i].pin_required;
            }
        }
        if(paket===""){addToast("Pilih Paket untuk melanjutkan!", {appearance: 'error',autoDismiss: true,})}
        else if(total_tiket<tiket_required){addToast("Tiket anda tidak cukup. Silahkan order Tiket terlebih dahulu.", {appearance: 'error',autoDismiss: true,})}
        else{
            router.push("/investment/payment/"+btoa(paket))
        }
    }

  return (
    <Layout title="Beli Paket">
        <div className="container mt-6 lg:px-6 md:px-3">
            <div className="flex justify-between">
            <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                Beli Paket
            </h2>
            <div>
                <div className="flex items-center justify-between mt-6 w-full p-2 lg:rounded-full md:rounded-full bg-white dark:bg-gray-700 dark:hover:bg-gray-800 border border-gray-700	 rounded-lg">
                <div className="lg:flex md:flex items-center">
                    <div className="flex flex-col px-3">
                    <div className="text-xs leading-3 text-gray-700 dark:text-gray-300 w-full">Tiket Anda :</div>
                    <div className="text-sm leading-3 text-center text-gray-700 dark:text-gray-300 mt-2 font-bold w-full">{total_tiket} Tiket</div>

                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div className="h-auto mt-8 w-full flex lg:flex-col justify-center items-center mb-20">
            <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  lg:mx-24">
                <div className="py-4 px-8 mt-3">
                    <div className="flex flex-col mb-8">
                        <h4 className="text-gray-700 dark:text-gray-200 font-semibold text-lg tracking-wide mb-2">Pilih Paket</h4>
                        <label className="block text-sm mt-2">
                            <Select
                                classNamePrefix="text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-white dark:hover:bg-gray-600 "
                                className=""
                                placeholder="Kategori Paket"
                                value={options.find(op => {return op.value === kategori})}
                                onChange={option => handleCategory(((option as iOpt)).value)}
                                options={options} />
                        </label>
                    </div>
                    <div className="max-h-96 overflow-auto">
                        {
                            loading?<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Card loading={loading} handleClick={(id)=>setPaket(id)} datum={({} as iPaket)}/></div>:
                            datumPaket?.length>0?(
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {
                                        datumPaket?.map((item:iPaket,i:number)=>{
                                            return (
                                                <Card
                                                    key={i}
                                                    isActive={parseFloat(item.price)>item.minimal_price}
                                                    selected={item.id===paket}
                                                    handleClick={(id)=>setPaket(id)}
                                                    datum={item}
                                                    loading={false}
            
                                                />
            
                                            )
                                        })
                                    }
                                </div>
                            )
                            :(
                                <div className="flex flex-grow lgLw-96"><div className='w-full text-gray-700 dark:text-gray-200 text-center text-xl'>Paket Tidak Tersedia.</div></div>
                            )
                        }
                        
                    </div>
                    <div className="py-4 mt-8">
                        <button 
                            onClick={handleCheckout}
                            className="block w-full tracking-widest uppercase text-center shadow bg-old-gold-600 hover:bg-old-gold-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded">Checkout</button>
                    </div>
                </div>
            </div>


            
        </div>

    </Layout>
);
}

export async function getServerSideProps(ctx:NextPageContext) {
    // Parse
    const cookies = nookies.get(ctx)

    if(!cookies._prowara){
        return {
        redirect: {
            destination: '/auth/login',
            permanent: false,
        },
        }
    }

    // manipulate PAKET
    let kate=[];
    let total_tiket=0;
    const options: iOpt[] =[];
    try {
        const getKategori = await Api.get(Api.apiUrl+"category/membership")
        if(getKategori.status===200){
            kate=getKategori.data.result.data;
            total_tiket=getKategori.data.result.total_tiket;
        }else{
            kate=[];
        }
        kate.map((item: iPaket)=>{
            return options.push({
                value: item.id,
                label: item.title
            })
        })
    } catch (err) {}

    // END PAKET

    // Destroy
    // nookies.destroy(ctx, 'cookieName')

    return { 
        props:{
            kategori:kate,
            total_tiket,
            options
        }
    }
}

export default Invoice;