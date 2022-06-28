import React, {useState} from 'react'
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

import File64,{iInfo} from 'components/Common/File64';
import Helper from 'lib/helper';

interface iOtp{
  open:boolean;
  closeModal:()=>void;
  callBack:(img:string)=>void;
}

const Otp: React.FC<iOtp> = ({open,closeModal,callBack}) => {
  const { addToast } = useToasts();
  const [images, setImages]=useState("-");
  
  const submitOtp=()=>{
    if(images==='-'){
      addToast("Silahkan pilih file terlebih dahulu.", {appearance: 'error',autoDismiss: true,})
    }else{
      callBack(images);
    }
   
  }
  
  const onDone = async (value:iInfo,status:boolean,msg:string) => {
    if(status){
      setImages(!Helper.isEmptyObj(value)?(value.base64 as string):'-')
    }else addToast(msg, {appearance: 'error',autoDismiss: true,})
  }
  return (
    <>
      <Modal isOpen={open} onClose={closeModal} >
        <ModalBody>
            <div className="w-full flex flex-col items-center justify-items-center">
                <img src="/logo.png" className="w-1/4"/>
                <h3 className="text-center mt-3 mb-6">Untuk mempercepat proses verifikasi, silahkan upload bukti transfer anda.</h3>
            </div>
            <File64
              maxSize={12000}
              fileType= 'png,jpg'
              ids='payment_slip'
              showPreview={true}
              previewAlign='center'
              previewLink= 'http://ptnetindo.com:6692/images/default.png'
              lang='id'
              onDone={onDone}
              previewConfig={{
                width:'150px',
                height:'150px'
              }}
            />
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={closeModal}>
            Batal
          </Button>
          <Button className="bg-old-gold hover:bg-old-gold-600 w-full sm:w-auto" onClick={submitOtp}>Upload</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default Otp;