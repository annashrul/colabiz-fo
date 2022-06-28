import React, {useState} from 'react'
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import OTPInput from 'components/Common/Otp';
import { useToasts } from 'react-toast-notifications'


interface iOtp{
  open:boolean;
  closeModal:()=>void;
  callBack:(pin:string)=>void;
}

const Otp: React.FC<iOtp> = ({open,closeModal,callBack}) => {
  const { addToast } = useToasts();
  const [otpInput, setOtpInput]=useState("");
  
  const submitOtp=()=>{
    if((otpInput.length)!==6)addToast("Pilih Paket untuk melanjutkan!", {appearance: 'error',autoDismiss: true,})
    else{
       callBack(otpInput);
    }
  }
  
  const onChangeOtp = async (value: string) => {
    setOtpInput(value);
    if((value.length)===6){
        callBack(value);
    }
  }
  return (
    <>
      <Modal isOpen={open} onClose={closeModal} >
        <ModalBody>
            <div className="w-full flex flex-col items-center justify-items-center">
                <img src="/logo.png" className="w-1/4"/>
                <h3 className="text-center mt-3">Demi keamanan akun anda, silahkan masukan PIN transaksi anda untuk melanjutkan transaksi.</h3>
            </div>
            <OTPInput
                autoFocus
                isNumberInput
                secure={true}
                length={6}
                className="my-4	px-auto text-lg flex items-center justify-center "
                inputClassName="otpInput w-10	h-10 text-white dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray"
                onChangeOTP={(otp) => onChangeOtp(otp)}
            />
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={closeModal}>
            Batal
          </Button>
          <Button className="bg-old-gold hover:bg-old-gold-600 w-full sm:w-auto" onClick={submitOtp}>Verifikasi</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Otp;