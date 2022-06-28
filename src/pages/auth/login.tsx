import React, {useState,useEffect} from 'react';
import { NextPageContext } from 'next'
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import { NextPage } from 'next';
import Sess from "lib/auth";
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2'
import OTPInput from 'components/Common/Otp';
import {useRouter} from 'next/router'
import nookies from 'nookies'
import Auth from 'components/Auth';
import Layout from 'Layouts';

interface iLogin  {
  // any modifications to the default context, e.g. query types
  apiUrl:string;
  otpLength: number;
}
const Login: NextPage<iLogin> = ({otpLength}) =>{ 
  const router = useRouter()

  // const cekSess = Sess.getToken();
  // cekSess!==undefined&&router.push('/') 

  const { addToast } = useToasts();
  const [otp, setOtp] = useState('-');
  const [counter, setCounter] = React.useState(0);
  const [startTimer, setStartTimer] = React.useState(false);
  const [otpInput, setOtpInput] = React.useState('');
  const [phone, setPhone] = useState('0');
  // const cek = Sess.getUser();
  useEffect(() => {
      if (counter > 0) {
        const timer = setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
      }

      if (counter === 0 && startTimer) {
        setStartTimer(false);
      }
    }, [counter, startTimer]);

  const onChangeOtp = async (value: string) => {
    setOtpInput(value);
    if((value.length)===4){
      await onCompareOtp();
    }
  }

  const onOtpRequest = async () =>{
    const clearNo = phone.replace(/[^A-Z0-9]/ig, "");
    if(clearNo===""){
      addToast("Silahkan isi no. handphone terlebih dahulu untuk melanjutkan.", {
        appearance: 'warning',
        autoDismiss: true,
      })
    }else if((clearNo.length+1)>15){
      addToast("Nomor tidak valid", {
        appearance: 'error',
        autoDismiss: true,
      })
    }else if((clearNo.length+1)<10){
      addToast("Nomor tidak valid", {
        appearance: 'error',
        autoDismiss: true,
      })
    }else{
      const phones = 62+clearNo;
      Swal.fire({
        title: 'Silahkan tunggu...',
        html: otp==='-'?'Sedang mengecek akun.':'Mengirim ulang OTP.',
        willOpen: () => {
            Swal.showLoading()
        },
        showConfirmButton:false,
        willClose: () => {}
      })
        try {
          const sendOtp=await Sess.http.post(Sess.http.apiClient+'auth/otp', {
                "nomor":phones,
                "type":"wa",
                "islogin":true
            })
             setTimeout(
              function () {
                  Swal.close()
                  // save token to localStorage
                  if(sendOtp.data.status==='success'){
                    const datum = sendOtp.data.result;
                    setOtp(datum.transaction_token)
                    setStartTimer(false);
                    setCounter(180)
                    otp!=='-'&& 
                      addToast("OTP berhasil dikirim ulang!", {
                        appearance: 'success',
                        autoDismiss: true,
                      })
                  }else{
                    addToast("Kesalahan pada server.", {
                        appearance: 'error',
                        autoDismiss: true,
                      })
                  }
            },800)
        
        } catch (err:any) {
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
      
  }

  const onCompareOtp = async () =>{

    if(otpInput.length===4){
      const clearNo = phone.replace(/[^A-Z0-9]/ig, "");
      const phones = 62+clearNo;

      Swal.fire({
            title: 'Silahkan tunggu...',
            html: "Mem-verifikasi akun anda.",
            willOpen: () => {
                Swal.showLoading()
            },
            showConfirmButton:false,
            willClose: () => {}
        })

        try {
          const hitLogin=await Sess.http.post(Sess.http.apiClient+'auth', {
              nohp:phones,
              type:"otp",
              otp_code:otpInput
          })

          setTimeout(
              function () {
                  Swal.close()
                  // save token to localStorage
                  const datum = hitLogin.data.result;
                  Sess.setUser({
                    id: datum.id,
                    foto: datum.foto,
                    fullname: datum.fullname,
                    mobile_no: datum.mobile_no,
                    referral: datum.referral,
                    status: datum.status,
                    created_at: datum.created_at
                  })
                  Sess.setToken(datum.token);
                  Sess.http.axios.defaults.headers.common["Authorization"] = datum.token;
                  if(datum.havePin) router.push('/');
                  else  router.push('/auth/pin/'+btoa(datum.id));
            },800)
        } catch (err:any) {
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

  }


  return (
    <Layout title="Login">
      <Auth title="Login" subTitle="Member Area Login">
         <div className="flex items-center justify-center pt-3 pb-10 px-6 sm:px-12 md:w-full">
                <div className="w-full">
                  {
                    otp==='-' || otp===undefined?(
                      <>
                        <label className="text-sm">
                          <span className=" text-gray-700 dark:text-gray-400">Nomor Handphone</span>
                        </label>
                        <div className="text-sm mt-2">
                          <IntlTelInput
                            inputClassName="block w-full mt-1 text-white dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                            preferredCountries={['id']}
                            onPhoneNumberChange={(status, value) => {
                                console.log(status);
                                setPhone(value.replace(/^0+/, ''))
                            }}
                            placeholder="Masukan no. handphone anda"
                            allowDropdown={false}
                            separateDialCode={true}
                            format={true}
                            formatOnInit={true}
                            value={phone}
                            />
                          
                        </div>
                      </>
                    ):(
                      <>
                        <label className="block text-sm text-center">
                          <span className="text-gray-700 dark:text-gray-400">Masukan 4 digit kode OTP yang anda terima melalui wa/sms.</span>
                          <br/>
                          {/* <span className="text-white">
                            {otp}
                          </span> */}
                        </label>
                        <div className="text-sm mt-2">
                            <OTPInput
                              autoFocus
                              isNumberInput
                              length={otpLength}
                              className="my-4	px-auto text-lg flex items-center justify-center "
                              inputClassName="otpInput w-10	h-10 text-white dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray"
                              onChangeOTP={(otp) => onChangeOtp(otp)}
                            />
                        </div>
                        <div className="text-gray-700 dark:text-gray-400 text-sm text-right">
                          {counter>0?
                            `Kirim ulang dalam ${counter} Detik.`
                            :
                            <button 
                              className="underline text-blue-600"
                              onClick={onOtpRequest}
                              >
                                Kirim ulang.
                              </button>
                          }
                        </div>

                      </>
                    )
                  }
                  {/* You should use a button here, as the anchor is only used for the example  */}
                  <button 
                    className="block w-full px-4 py-2 mt-7 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-gradient-to-r from-old-gold-400 via-old-gold-500 to-old-gold-600 border border-transparent rounded-lg active:bg-old-gold-500 hover:bg-old-gold-600 outline-none focus:shadow-outline-old-gold dark:text-gray-200 " 
                    onClick={otp==='-' || otp===undefined?onOtpRequest:onCompareOtp} 
                  >
                    {otp==='-' || otp===undefined?"Masuk":"Verifikasi"}
                  </button>
                </div>
              </div>

      </Auth>
    </Layout>
  );
}
export async function getServerSideProps(ctx:NextPageContext) {
  // Parse
  const cookies = nookies.get(ctx)
  if(cookies._prowara!==undefined){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { 
    props:{
      cookies,
      apiUrl:Sess.http.apiUrl,
      otpLength:4
    }
  }
}

export default Login
