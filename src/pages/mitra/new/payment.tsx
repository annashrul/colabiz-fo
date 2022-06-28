import React, {useState} from 'react';
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import { Card, CardBody } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2'

import Helper from 'lib/helper'
import Layout from 'Layouts'
import Api from 'lib/httpService';
import {iRegist,iBankPt} from 'lib/interface';
import CardBank from 'components/payment/CardBank';
import Preview from 'components/payment/Preview'
import Button from 'components/Common/Button'

interface iCards {
  dataRegister: iRegist;
  dataBank:Array<iBankPt>;
}

const Payment: React.FC<iCards> = ({dataRegister,dataBank}) => {
  const { addToast } = useToasts();
  const router = useRouter()

  const [bank,setBank]=useState('-');
  
  const doPay=async ()=>{
    if(bank==='-'){addToast("Pilih Bank Tujuan Terlebih Dahulu!", {appearance: 'warning',autoDismiss: true});return;}
    else{
      Swal.fire({
            title   : 'Perhatian !!!',
            html    :`Pastikan data yang anda masukan telah benar.`,
            icon    : 'warning',
            showCancelButton: true,
            confirmButtonColor  : '#3085d6',
            cancelButtonColor   : '#d33',
            confirmButtonText   : `Lanjutkan`,
            cancelButtonText    : 'Batal',
        }).then(async (result) => {
            if (result.value) {
                Swal.fire({
                      title: 'Silahkan tunggu...',
                      html: "Mem-validasi data mitra.",
                      willOpen: () => {
                          Swal.showLoading()
                      },
                      showConfirmButton:false,
                      willClose: () => {}
                })
        
                try {
                  const submitRegister=await Api.post(Api.apiClient+'auth/register', {
                    fullname: dataRegister.fullname,
                    mobile_no:dataRegister.mobile_no,
                    nik:dataRegister.nik,
                    sponsor:dataRegister.sponsor,
                    signup_source:dataRegister.signup_source,
                    id_paket:dataRegister.id_paket,
                    id_bank_destination:bank,
                    bank:dataRegister.bank
                  })
        
                  setTimeout(
                      function () {
                          Swal.close()
                          const datum = submitRegister.data;
                          if(datum.status==='success'){
                            // remove regist data
                            Helper.removeCookie('_regist');
                            
                            //  Go to invoice page
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
        })


    }
  }
  return (
    <Layout title="Dashboard">
      <div className="container mt-6 px-4 lg:px-7 mx-auto grid mb-20">
        <div className="flex justify-between">
          <div>
            <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
              Pendaftaran Mitra Baru
            </h2>
          </div>
        </div>
        <div className="w-full mt-8 min-h-0 h-auto">
          <Preview datum={dataRegister}/>
        </div>
        <Card className="w-full mt-8 min-h-0 h-auto">
          <CardBody>
            <h5 className="ml-4 mt-6 text-xl text-gray-700 dark:text-gray-200">
              Pilih Bank Tujuan
            </h5>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-1 p-5">
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
            <div className="text-right mr-5">
              <Button
                style="mt-5 text-gray-700 dark:text-gray-200 px-5 py-3 text-sm"
                title="Edit data mitra"
                color="base-blue"
                size="sm"
                handleClick={()=>router.push("/mitra/new")}
              />
              <Button
                style="mt-5 text-gray-700 dark:text-gray-200 px-5 py-3 text-sm ml-3"
                title="Lanjutkan Pendaftaran!"
                color="old-gold"
                size="sm"
                handleClick={doPay}
              />
            </div>
          </CardBody>
        </Card>
       
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
  if(!cookies._regist){
    return {
      redirect: {
        destination: '/mitra/new',
        permanent: false,
      },
    }
  }
  const userData = JSON.parse(Helper.decode(cookies.__uid));
  const dataRegister = JSON.parse(Helper.decode(cookies._regist));

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
      userData,
      dataRegister,
      dataBank
    }
  }
}

export default Payment;