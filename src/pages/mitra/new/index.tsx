import React, {useState,useEffect} from 'react';
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import Select from 'react-select'
import { Card, CardBody } from '@windmill/react-ui'
import atob from 'atob';
import { useForm,SubmitHandler } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications'
import Swal from 'sweetalert2'
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import bcrypt from 'bcryptjs'
import { Alert } from '@windmill/react-ui'
import { nikParser } from 'nik-parser'

import Layout from 'Layouts'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import Button from 'components/Common/Button'
import {iUser,iPaket,iOpt,iBankData,iRegist} from 'lib/interface';

interface iCards {
  dataRegister:iRegist;
  dataPaket: Array<iPaket>;
  options: Array<iOpt>;
  userData: iUser;
  optBank:Array<iOpt>;
  total_tiket:number;
}

type FormValues = {
  fullname:string;
  mobile_no:string;
  nik:string;
  atasnama:string;
  rekening:string;
};
const TambahMitra: React.FC<iCards> = ({dataPaket,dataRegister,options,userData,optBank,total_tiket}) => {
  const { addToast } = useToasts();
  const router = useRouter()

  const {register, handleSubmit, errors,setValue} = useForm<FormValues>();
  const [datumPaket,setDatumPaket]= useState<iPaket>();
  const [paket,setPaket]= useState("");
  const [phone,setPhone]= useState("");
  const [bank,setBank]= useState("-");
  const [sponsor,setSponsor]= useState("other");
  const [namaSponsor,setNamaSponsor]= useState("");
  const [uids,setUids]=useState("");
  const [otp,setOtp]=useState("");
  // const [otpDummy,setOtpDummy]=useState("");
  const [otpInput,setOtpInput]=useState("");
  const [validPhone,setValidPhone]=useState(false);
  const [counter, setCounter] = React.useState(0);
  const [startTimer, setStartTimer] = React.useState(false);
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
		if (!Helper.isEmptyObj(dataRegister)) {
      setValue("fullname", dataRegister.fullname);
			setValue("nik", dataRegister.nik);
			setValue("atasnama", dataRegister.bank.acc_name);
			setValue("rekening", dataRegister.bank.acc_no);
			setPhone(dataRegister.mobile_no);
      setValidPhone(true)
      setPaket(dataRegister.id_paket)
      for (var i=0; i < dataPaket.length; i++) {
          if (dataPaket[i].id === dataRegister.id_paket) {
            setDatumPaket(dataPaket[i]);
          }
      }
      setSponsor(dataRegister.typeSponsor)
      setNamaSponsor(dataRegister.namaSponsor)
      setBank(dataRegister.bank.bank_name)
		}

    if (counter > 0) {
        const timer = setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
      }

      if (counter === 0 && startTimer) {
        setStartTimer(false);
      }
	}, [setValue,counter,startTimer]);

  const handleSearchSponsor= async (uid:string)=>{
    if(uid==="") addToast("Silahkan isi USERID sponsor terlebih dahulu.", {
        appearance: 'warning',
        autoDismiss: true,
      })
    else{
      Swal.fire({
            title: 'Silahkan tunggu...',
            html: 'Mengecek data sponsor.',
            willOpen: () => {
                Swal.showLoading()
            },
            showConfirmButton:false,
            willClose: () => {}
        })
        try {
          const cekSponsor=await Api.get(Api.apiClient+`member/uid/${uid}?id_upline=${userData.referral}`)
          if(cekSponsor.status===200){
            setTimeout(
              function () {
                  Swal.close()
                  if(cekSponsor.data.status==='success'){
                    setNamaSponsor(cekSponsor.data.result.fullname);
                  }else{
                    addToast("Kesalahan pada server.", {
                        appearance: 'error',
                        autoDismiss: true,
                      })
                  }
            },500)
          }
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
  }

  const handlePaket=(opt:string)=>{
    setPaket(opt);
    for (var i=0; i < dataPaket.length; i++) {
        if (dataPaket[i].id === opt) {
          setDatumPaket(dataPaket[i]);
        }
    }
  }

  const onSubmit: SubmitHandler<FormValues> = data => {
    if(datumPaket===undefined){addToast("Pilih Paket Terlebih Dahulu!", {appearance: 'warning',autoDismiss: true});return;}
    else if(total_tiket<datumPaket.pin_required){addToast("Tiket anda kurang! Silahkan beli tiket terlebih dahulu.", {appearance: 'warning',autoDismiss: true});return;}
    else if(sponsor==='other' && uids==="") {addToast("Cari sponsor terlebih dahulu! Atau pilih anda sebagai sponsor.", {appearance: 'warning',autoDismiss: true});return;}
    else if(!validPhone) {addToast("Verifikasi nomor telepon untuk melanjutkan.", {appearance: 'warning',autoDismiss: true});return;}
    else if(bank==="-") {addToast("Pilih BANK terlebih dahulu.", {appearance: 'warning',autoDismiss: true});return;}
    else if(!checkbox) {addToast("Baca dan setujui Terms and Conditions untuk melanjutkan.", {appearance: 'warning',autoDismiss: true});return;}
    else{
      const clearNo = phone.replace(/[^A-Z0-9]/ig, "");
      const phones = 62+clearNo;
      const checkNik = nikParser(data.nik);
      if(!checkNik.isValid()){addToast("NIK tidak valid.", {appearance: 'warning',autoDismiss: true});return;}
      else{
        const datum = {
            fullname: data.fullname,
            mobile_no:phones,
            nik:data.nik,
            sponsor:sponsor==='other'?uids:userData.referral,
            signup_source:"Website",
            id_paket:datumPaket.id,
            id_bank_destination:'-',
            datumPaket,
            typeSponsor:sponsor,
            namaSponsor:namaSponsor,
            bank:{
              bank_name:bank,
              acc_name:data.atasnama,
              acc_no:data.rekening
            }
        }
        Helper.removeCookie('_regist');
        Helper.setCookie("_regist",JSON.stringify(datum));
        router.push("/mitra/new/payment")
      }

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
      if(!validPhone){
        if(counter==0){
          const phones = 62+clearNo;
          Swal.fire({
                title: 'Silahkan tunggu...',
                html: 'Mengirim Kode Aktivasi ke nomor mitra.',
                willOpen: () => {
                    Swal.showLoading()
                },
                showConfirmButton:false,
                willClose: () => {}
          })
          try {
            const sendOtp=await Api.post(Api.apiClient+'auth/otp', {
                  "nomor":phones,
                  "type":"wa",
                  "isRegister":true
              })
                setTimeout(
                function () {
                    Swal.close()
                    // save token to localStorage
                    if(sendOtp.data.status==='success'){
                      const datum = sendOtp.data.result;
                      setCounter(180)
                      setOtp(datum.sender_id)
                      // setOtpDummy(datum.otp_anying)
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
    }
      
  }
  
  const onCompareOtp = ()=>{  
    bcrypt.compare(otpInput, otp, function(err, res) {
      if(!err){
        setValidPhone(res)
        setCounter(0)
      }
    });

  }

  const onReset = ()=>{
    Swal.fire({
            title   : 'Perhatian !!!',
            html    :`Data yang telah anda isi akan hilang.`,
            icon    : 'warning',
            showCancelButton: true,
            confirmButtonColor  : '#3085d6',
            cancelButtonColor   : '#d33',
            confirmButtonText   : `Reset`,
            cancelButtonText    : 'Batal',
        }).then(async (result) => {
            if (result.value) {
              Helper.removeCookie("_regist");
              router.reload();
            }
        })
  }

  return (
    <Layout title="Tambah Mitra">
      <div className="container mt-6 lg:px-7 mx-auto grid mb-20">
        <div className="flex justify-between">
          <div>
            <h2 className="mt-6 text-2xl align-middle	 font-semibold text-gray-700 dark:text-gray-200">
              Pendaftaran Mitra Baru
            </h2>
          </div>
          <div>
            <div className="flex items-center justify-between mt-6 w-full p-2 lg:rounded-full md:rounded-full bg-white dark:bg-gray-700 dark:hover:bg-gray-800 border border-gray-700	 rounded-lg">
              <div className="lg:flex md:flex items-center">
                <div className="flex flex-col px-3">
                  <div className="text-xs leading-3 text-gray-700 dark:text-gray-300 w-full">Tiket Anda :</div>
                  <div className="text-sm leading-3 text-center text-gray-700 dark:text-gray-300 mt-2 font-bold w-full">{total_tiket}</div>

                </div>
              </div>
            </div>
          </div>
        </div>
          <Card className="w-full mt-8 min-h-0 h-auto">
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Pilih Paket
                    </span>
                    <Select
                      classNamePrefix="text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-white dark:hover:bg-gray-600 "
                      className=""
                      placeholder="Pilih paket"
                      value={options.find(op => {return op.value === paket})}
                      onChange={option => handlePaket(((option as iOpt)).value)}
                      options={options} />
                  </label>
                  {/* card paket */}
                
                <div className={datumPaket!==undefined?"flex lg:w-1/2 sm:w-full content-center	self-center m-auto items-center justify-items-center lg:p-4 p-1 mt-4 rounde-lg":"hidden"}>
                  <div className="flex items-start  w-full p-2 lg:rounded-full md:rounded-full bg-white dark:bg-gray-700 dark:hover:bg-gray-800 border border-gray-700	 rounded-lg">
                    <div className="py-1 px-2 text-sm lg:h-auto text-gray-700 dark:text-gray-100  focus:outline-none w-1/3 lg:w-1/6">
                        <img src="/logo.png" className="w-full "/>
                      </div>
                      <div className="py-1 px-2  text-sm text-gray-700 dark:text-gray-100 focus:outline-none mt-3 lg:mt-4  w-2/3 lg:w-5/6">
                        <div className="text-sm leading-3 text-gray-700 dark:text-gray-400 font-bold w-full">{datumPaket?.title}</div>
                        <div className="text-gray-600 mt-3 text-xs dark:text-gray-300  w-full">
                          Tiket Dibutuhkan : {datumPaket?.pin_required}, Harga : {Helper.numFormat((datumPaket?.price as string))} 
                        </div>
                      </div>
                  </div>
                </div>
                <div className=" mt-4 flex w-full content-center	self-center m-auto items-center justify-items-center ">
                  <button
                      type="button"
                      className={
                        sponsor==='other'?
                        "py-1 px-2 text-sm  bg-old-gold-500 text-gray-700 dark:text-gray-100  border-4 border-old-gold-500  focus:outline-none w-1/3 lg:w-1/2"
                        :
                        "py-1 px-2 text-sm text-gray-700 dark:text-gray-100  border-4 border-old-gold-500 focus:outline-none  w-1/3 lg:w-1/2"
                      }
                      onClick={(event)=>{
                        event.preventDefault();
                        setSponsor('other');
                      }}
                    >
                    Sponsor
                  </button>
                  <button
                    type="button"
                    className={
                        sponsor!=='other'?
                        "py-1 px-2 text-sm  bg-old-gold-500 text-gray-700 dark:text-gray-100  border-4 border-old-gold-500  focus:outline-none w-2/3 lg:w-1/2"
                        :
                        "py-1 px-2 text-sm text-gray-700 dark:text-gray-100  border-4 border-old-gold-500 focus:outline-none  w-2/3 lg:w-1/2"
                      }
                    onClick={(event)=>{
                        event.preventDefault();
                        setSponsor('me');
                      }}
                  >
                    Saya Sebagai Sponsor
                  </button>
                </div>

                <div className={sponsor==='other'?"mt-4 flex":"hidden"}>
                  <input 
                  className="block w-full mt-1 px-3 text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none  dark:text-gray-300 div-input" 
                  placeholder="User ID sponsor" 
                  value={uids}
                  onChange={(event)=>setUids(event.target.value)}
                  />
                  <button 
                    className="px-8 rounded-r-lg bg-old-gold  text-gray-800 font-bold p-3 mt-1 uppercase border-yellow-500 border-t border-b border-r"
                    onClick={(event)=>{event.preventDefault();handleSearchSponsor(uids)}}
                    >
                    <svg className="text-gray-200 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966"  xmlSpace="preserve" width="512px" height="512px">
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </button>
                </div>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Sponsor</span>
                    <input 
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input cursor-not-allowed" 
                    value={sponsor==='other'?namaSponsor:userData?.fullname}
                    readOnly />
                  </label>
                  
                  {/***  
                    * DATA DIRI
                  */}

                  <h6 className="mt-5 border-b border-gray-700 pb-1 text-bold text-gray-700 dark:text-gray-400">
                      Data Diri
                  </h6>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nama Lengkap</span>
                    <input 
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      name="fullname"
                      ref={register({required: true, maxLength: 80})}
                      placeholder="Nama Lengkap Mitra" />
                  </label>

                    {/* <input 
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                    name="mobile_no"
                    ref={register({required: true, maxLength: 14})}
                     /> */}
                  <label className="flex mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nomor Telepon</span>
                  </label>
                  <div className="flex flex-col lg:flex-row">
                    <div className="text-sm mt-2 flex-grow">
                        <IntlTelInput
                          disabled={validPhone}
                          inputClassName="block w-full mt-1 text-white dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                          preferredCountries={['id']}
                          onPhoneNumberChange={(status, value) => {
                            console.log(status);
                              setPhone(value.replace(/^0+/, ''))
                          }}
                          placeholder="Masukan no. handphone mitra"
                          allowDropdown={false}
                          separateDialCode={true}
                          format={true}
                          formatOnInit={true}
                          value={phone}
                          />
                    </div>
                    <button 
                    className="px-8 rounded-lg lg:rounded-l-none bg-old-gold  text-gray-200  text-sm font-bold p-2 mt-2 uppercase border-yellow-500 border-t border-b border-r"
                    onClick={(event)=>{event.preventDefault();onOtpRequest();}}
                    >
                      {
                        validPhone?"Terverifikasi":
                        otp===""?"Check":counter>0?
                            `Kirim ulang dalam ${counter} Detik.`
                            :"Kirim ulang."
                      }
                    </button>
                  </div>
                  <div className={otp!=="" && !validPhone?"flex flex-col mt-5 items-center px-0 lg:px-32":"hidden"}>
                    <div className="flex">
                      <div className="text-sm mt-2">
                        <input 
                          className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                          type="number"
                          onChange={(event)=>{setOtpInput(event.target.value)}}
                          value={otpInput} />
                      </div>
                      <button 
                      className="px-8 rounded-r-lg bg-old-gold   text-gray-200 font-bold p-1 mt-3 uppercase border-yellow-500 border-t border-b border-r"
                      onClick={(event)=>{event.preventDefault();onCompareOtp()}}
                      >
                        Validasi
                      </button>

                    </div>
                    <Alert className="flex items-center text-white text-sm font-bold mt-3 ml-4 p-2  flex-grow" type="warning">Silahkan masukan 6 digit kode aktivasi yang dikirim ke Whatsapp ke mitra anda. <br/> Kode ini digunakan untuk me-verifikasi bahwa nomor mitra anda benar benar aktif.</Alert>

                  </div>

                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">No. KTP</span>
                    <input 
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                    name="nik"
                    type="number"
                    ref={register({required: true, maxLength: 16})}
                    placeholder="105024xxxxxxxxxx" />
                    <div className={`text-red-700 mt-3 text-xs ${errors.nik!==undefined?'block':"hidden"}`}>{errors.nik && "No. KTP dibutuhkan."}</div>
                  </label>


                  <h6 className="mt-5 border-b border-gray-700 pb-1 text-bold text-gray-700 dark:text-gray-400">
                      Data Rekening
                  </h6>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Bank</span>
                   <Select
                      classNamePrefix="text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-white  "
                      className=""
                      placeholder="Pilih Bank"
                      value={optBank.find(op => {return op.label === bank})}
                      onChange={option => setBank(((option as iOpt)).label)}
                      options={optBank} />
                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nama Pemilik</span>
                    <input 
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                    name="atasnama"
                    ref={register({required: true, maxLength: 30})}
                    placeholder="Pemilik Rekening" />
                    <div className={`text-red-700 mt-3 text-xs ${errors.atasnama!==undefined?'block':"hidden"}`}>{errors.atasnama && "Data pemilik rekening dibutuhkan."}</div>

                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">No. Rekening</span>
                    <input 
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" 
                    name="rekening"
                    ref={register({required: true, maxLength: 20})}
                    placeholder="1511xxxxx" />
                    <div className={`text-red-700 mt-3 text-xs ${errors.rekening!==undefined?'block':"hidden"}`}>{errors.rekening && "Data no. rekening dibutuhkan."}</div>

                  </label>

                  <label className="inline-flex items-center mt-8">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" onChange={(event)=>setCheckbox(event.target.checked)}/>
                    <span className="ml-2 text-gray-700 dark:text-gray-400 text-xs">
                      Saya Setuju Dengan Persyaratan dan Kondisi Pendaftaran.<br/>
                      <button className='text-old-gold'>Terms & Conditions</button>
                    </span>
                  </label>

                  <div className="text-right mr-5">
                    <Button
                      style="mt-5 text-gray-700 dark:text-gray-200 px-5 py-3 text-sm"
                      title="Daftarkan Mitra!"
                      color="old-gold"
                      size="sm"
                    />

                    <button 
                      onClick={(event)=>{event.preventDefault();onReset();}}
                      className="mt-5 text-gray-700 dark:text-gray-200 ml-4 px-5 py-3 text-sm bg-maroon-700 border-0  focus:outline-none rounded"
                      >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
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
  const dataRegister = cookies._regist===undefined?{}:JSON.parse(Helper.decode(cookies._regist));
  const userData = JSON.parse(atob(cookies.__uid));

  // manipulate PAKET
  let paket=[];
  let total_tiket=0;
  const options: iOpt[] =[];
  try {
      const getPaket = await Api.get(Api.apiUrl+"paket?perpage=100")
      if(getPaket.status===200){
        paket=getPaket.data.result.data;
        total_tiket=getPaket.data.result.total_tiket;
      }else{
        paket=[];
      }
      paket.map((item: iPaket)=>{
        return options.push({
          value: item.id,
          label: item.title
        })
      })
  } catch (err) {}

  // END PAKET

  // GET BANK DATA
  let banks=[];
  const optionsBank: iOpt[] =[];
  try {
    const getBank = await Api.get(Api.apiUrl+"bank/data")

    if(getBank.status===200){
      banks=getBank.data.result;
    }else{
      banks=[];
    }

    banks.map((item: iBankData)=>{
      return optionsBank.push({
        value: item.id,
        label: item.name
      })
    })
  } catch (err) {}

  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { 
    props:{
      dataRegister,
      options,
      dataPaket:paket,
      userData,
      optBank:optionsBank,
      total_tiket
    }
  }
}

export default TambahMitra;