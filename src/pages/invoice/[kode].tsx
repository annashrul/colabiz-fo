import React,{useEffect,useState} from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import { Card, CardBody, Button } from '@windmill/react-ui'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2';
import { useToasts } from 'react-toast-notifications'

import Api from 'lib/httpService'
import Helper from 'lib/helper';
import CardBank from 'components/payment/CardBank';
import PaymentSlip from 'components/payment_slip';

interface iInvoice{
    kode:string;
    datum:iPayment;
}

const Invoice: React.FC<iInvoice> =({kode,datum})=> {
  const router = useRouter();
  const [open,setOpen]=useState(false);
  const { addToast } = useToasts();
  useEffect(() => {
    if (Helper.isEmptyObj(datum)) {
      Swal.fire({
          title   : 'Perhatian!',
          html    :`Invoice dengan nomor #${kode} tidak ditemukan atau telah selesai.`,
          icon    : 'warning',
          showCancelButton: false,
          confirmButtonColor  : '#D4AF37',
          confirmButtonText   : `Oke`,
      }).then(async (result) => {
          if (result.value) {
            router.push('/')
          }
      })
    }
  }, []);

  const doUpload=async(img:string)=>{
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
        
        const doUpload=await Api.put(Api.apiClient+`transaction/deposit/${btoa(kode)}`, {bukti:img})

        setTimeout(
            function () {
                Swal.close()
                const datum = doUpload.data;
                if(datum.status==='success'){
                  addToast("Berhasil memproses permintaan.", {
                    appearance: 'success',
                    autoDismiss: true,
                  })
                  setOpen(false);
                  //  Go to invoice page
                  router.reload();
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

  const doCancel=async()=>{
    Helper.mySwalWithCallback("Apakah anda yakin akan membatalkan transaksi?",async ()=>{
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
        
        const doUpload=await Api.post(Api.apiClient+`transaction/deposit/${btoa(kode)}`, {status:2})

        setTimeout(
            function () {
                Swal.close()
                const datum = doUpload.data;
                if(datum.status==='success'){
                  addToast("Berhasil membatalkan transaksi.", {
                    appearance: 'success',
                    autoDismiss: true,
                  })
                  setOpen(false);
                  //  Go to invoice page
                  router.push('/');
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
    })
  }



  return (
    <Layout title={`Invoice`}>
        <div className="container mt-6 lg:px-6 md:px-3">
            <div className="flex justify-between">
            <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
                #{kode}
            </h2>
            </div>
        </div>
        <div className="h-auto mt-8 w-full flex flex-col lg:m-w-96 justify-center items-center mb-20">
            <div className="bg-white dark:bg-gray-700 shadow-md  overflow-hidden  lg:mx-24 lg:w-2/3">
                <div className="py-4 px-8 mt-3 text-gray-700 dark:text-gray-200 flex flex-col items-center justify-items-center">
                    <div className="p-3 text-center">
                      <h3 className="text-lg">Silahkan transfer sebesar:</h3>
                      <Card colored className="bg-old-gold mt-6">
                        <CardBody>
                          <p className="text-white text-xl">
                            {Helper.rupiahFormat(`${parseInt(datum.grand_total)+datum.kd_unique}`)}
                          </p>
                        </CardBody>
                      </Card>
                      <div className="text-xs mt-4"><b>Note: Silahkan transfer sesuai dengan nominal yang tertera untuk mempercepat proses verifikasi.</b></div>
                      <hr className="mt-6 mb-3"/>

                      <h3 className="mt-3 mb-4 text-lg">Pembayaran dapat dilakukan ke rekening berikut :</h3>
                      <ul>
                       <CardBank 
                          selected={false}
                          id={'saldo'}
                          title={datum.bank_name}
                          acc_name={datum.acc_name}
                          acc_no={datum.acc_no}
                          logo={datum.logo}
                          handleClick={()=>{}}
                        />

                      </ul>
                      <hr className="mt-6 mb-3"/>
                      <h3>
                        Anda dapat melakukan transfer menggunakan ATM, Mobile Banking atau SMS Banking dengan memasukan kode bank {datum.tf_code} di depan No.Rekening atas nama {datum.acc_name}
                      </h3>
                      <hr className="mt-6 mb-3"/>

                      <p>
                        Pastikan anda transfer sebelum tanggal {Helper.formatDate(datum.limit_tf,false)} atau transaksi anda otomatis dibatalkan oleh sistem. 
                        <br/>
                        Proses verifikasi akan memakan waktu 10-15 menit. Untuk mempercepat proses verifikasi silahkan sertakan bukti transfer.
                      </p>
                    </div>
                    <div className="py-4 mt-8 text-right">
                      {
                        datum.payment_slip==='-'?
                        <Button className="bg-base-blue hover:bg-base-blue-600 w-full sm:w-auto mr-6" onClick={()=>{setOpen(true)}}>Upload Bukti Transfer</Button>
                        :
                        <Button className="bg-base-blue hover:bg-base-blue-600 w-full sm:w-auto mr-6 cursor-not-allowed">Bukti transfer terkirim.</Button>
                      }
                        <Button className="bg-base-red hover:bg-base-red-600 w-full mt-4 lg:mt-0 sm:w-auto mr-6" onClick={doCancel}>Batalkan Transaksi</Button>
                        <Button className="bg-old-gold hover:bg-old-gold-600 w-full mt-4 lg:mt-0 sm:w-auto" onClick={()=>{router.push('/')}}>Kembali</Button>
                    </div>
                </div>
            </div>


            
        </div>

        <PaymentSlip
          open={open}
          closeModal={()=>{setOpen(false)}}
          callBack={doUpload}
        />

    </Layout>
);
}

interface iPayment{
  kd_trx: string;
  kd_unique: number;
  grand_total: string;
  bank_name: string;
  acc_name: string;
  acc_no: string;
  tf_code: string;
  payment_slip: string;
  logo: string;
  limit_tf: string;
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

    let datum={};
    try {
        const getDetail = await Api.get(Api.apiUrl+"transaction/get_payment/"+kode)
        if(getDetail.status===200){
            datum=getDetail.data.result;
        }
    } catch (err) {
    }



    return { 
        props:{
            kode:decodeKode,
            datum
        }
    }
}

export default Invoice;