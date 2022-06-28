import React,{useState} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'

import Helper from 'lib/helper';
import {iPaket, iBankPt} from 'lib/interface'
import Api from 'lib/httpService'
import CardBank from 'components/payment/CardBank';
import Modal from 'components/pin'

interface iInvoice{
  datum:iPaket;
  dataBank:Array<iBankPt>;
}

const Invoice: React.FC<iInvoice> =({dataBank,datum})=> {
  const router = useRouter()
  const { addToast } = useToasts();
  const [bank,setBank]=useState('-');
  const [open,setOpen]=useState(false);

  const doVerif=()=>{
    if(bank==="-")addToast("Pilih Metode Pembayaran terlebih dahulu untuk melanjutkan!", {appearance: 'warning',autoDismiss: true,})
    else{
      setOpen(true);
    }
  }

  const doCheckout= async (pin:string)=>{
      Swal.fire({
            title: 'Silahkan tunggu...',
            html: "Memproses permintaan.",
            willOpen: () => {
                Swal.showLoading()
            },
            showConfirmButton:false,
            willClose: () => {}
      })

      try {
        const checkoutData={
          member_pin:pin,
          id_bank_destination:bank==='saldo'?'-':bank,
          id_paket:datum.id,
          metode_pembayaran:bank==='saldo'?'saldo':'transfer'
        }
        
        const submitRegister=await Api.post(Api.apiClient+'transaction/paket', checkoutData)

        setTimeout(
            function () {
                Swal.close()
                const datum = submitRegister.data;
                if(datum.status==='success'){
                  addToast("Berhasil memproses permintaan.", {
                    appearance: 'success',
                    autoDismiss: true,
                  })
                  setOpen(false);
                  //  Go to invoice page
                  bank==='saldo'?
                  router.push(`/`):
                  router.push(`/invoice/${btoa(datum.result)}`);

                }else{
                  addToast(datum.msg, {
                    appearance: 'error',
                    autoDismiss: true,
                  })
                }
          },800)
      } catch (err) {
        setTimeout(
            function () {
                Swal.close()
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

  return (
    <Layout title="Pembayaran Paket">
        <Modal 
          open={open}
          closeModal={()=>setOpen(false)}
          callBack={(val)=>doCheckout(val)}
          />
        <div className="container mt-6 lg:px-6 md:px-3">
          <div className="flex justify-between">
          <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
              Beli Paket
          </h2>
        </div>
        <div className="h-auto mt-8 w-full flex flex-col lg:flex-row gap-8 mb-20">
            <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  w-full">
                <div className="py-1 px-8 mt-6">
                    <div className="flex flex-col ">
                        <h4 className="text-gray-700 dark:text-gray-200 font-semibold text-lg tracking-wide mb-2">Pilih Metode Pembayaran</h4>
                        
                    </div>
                    <div className="overflow-auto py-3">
                       <div className="grid gap-4 grid-cols-1 mt-1 p-1">
                          <CardBank 
                              selected={bank==='saldo'}
                              id={'saldo'}
                              title="Saldo"
                              acc_name={`${Helper.numFormat(`${datum.total_poin}`)}`}
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
                                  handleClick={(id:string)=>setBank(id)}
                                />

                              )
                            })
                          }
                        </div>
                      
                        
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  w-full">
                <div className="py-4 px-8 mt-3">
                    <div className="flex flex-col ">
                        <h4 className="text-gray-700 dark:text-gray-200 font-semibold text-lg tracking-wide mb-2">Detail Pembelian Paket</h4>
                    </div>
                    <div className="mt-5 overflow-auto">
                       <table className="w-full whitespace-no-wrap">
                        <tbody className="divide-y dark:divide-gray-700 0">
                            <tr className="text-gray-500 dark:text-gray-400">
                                <td className="text-base w-2/5">Paket </td>
                                <td className="py-3 text-base w-1/5">:</td>
                                <td className="py-3 text-left w-2/5 ml-10 text-base">{datum.title}</td>
                            </tr>
                            <tr className="text-gray-500 dark:text-gray-400">
                                <td className="py-3 text-base w-2/5">Tiket digunakan </td>
                                <td className="py-3 text-base w-1/5">:</td>
                                <td className="py-3 text-left w-2/5 ml-10 text-base">{datum.pin_required} Tiket</td>
                            </tr>
                            <tr className="text-gray-500 dark:text-gray-400">
                                <td className="py-3 text-base w-2/5">Modal </td>
                                <td className="py-3 text-base w-1/5">:</td>
                                <td className="py-3 text-left w-2/5 ml-10 text-base">{Helper.numFormat(`${datum.price}`)}</td>
                            </tr>
                            <tr className="text-gray-500 dark:text-gray-400">
                                <td className="py-3 text-base w-2/5">Kontrak </td>
                                <td className="py-3 text-base w-1/5">:</td>
                                <td className="py-3 text-left w-2/5 ml-10 text-base">{datum.contract} Hari</td>
                            </tr>
                            <tr className="text-gray-500 dark:text-gray-400">
                                <td className="py-3 text-base w-2/5">Share Profit </td>
                                <td className="py-3 text-base w-1/5">:</td>
                                <td className="py-3 text-left w-2/5 ml-10 text-base">{Helper.numFormat(`${datum.contract*datum.profit_sharing}`)}</td>
                            </tr>
                        </tbody>
                      </table>
                        
                    </div>
                    <div className="pt-4 pb-1 mt-11 w-full text-right" >
                        <h6 className="text-gray-500 dark:text-gray-400 text-bold text-xl">Grand Total: {Helper.numFormat(`${datum.price}`)}</h6>
                    </div>
                    <div className="py-1 mt-1">
                        <button 
                          onClick={()=>doVerif()}
                          className="block w-full tracking-widest uppercase text-center shadow bg-old-gold-600 hover:bg-old-gold-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded">Checkout</button>
                    </div>
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
    const { kode } = ctx.query;
    const decodeKode = Helper.decode(kode as string);

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

    let datum=[];
    try {
        const getDetail = await Api.get(Api.apiUrl+"transaction/paket/"+decodeKode)
        if(getDetail.status===200){
            datum=getDetail.data.result;
        }else{
            datum=[];
        }
    } catch (err) {
    }

     // GET BANK DATA
    let dataBank=[];
    try {
      const getBank = await Api.get(Api.apiUrl+"bank?perpage=20")

      if(getBank.status===200){
        dataBank=getBank.data.result.data;
      }else{
        dataBank=[];
      }
    } catch (err) {}

    return { 
        props:{
            datum,
            dataBank
        }
    }
}

export default Invoice;