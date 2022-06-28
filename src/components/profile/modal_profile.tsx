import React, { useState,useEffect } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import { handlePut,handleGet } from 'lib/handleAction';
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import Sess from "lib/auth";

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface iModalProfile {
  open: boolean;
  closeModal: () => void;
  userData: any;
}
const ModalProfile: React.FC<iModalProfile> = ({ open, closeModal, userData }) => {
  const { addToast } = useToasts();
  const [fname,setFname]=useState("");
  const [image, setImage] = useState('');
  const [cropper, setCropper] = useState<any>();
  const router = useRouter()

  useEffect(()=>{
    setFname(userData.fullname)
  },[])

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const toggleModal = () => {
    closeModal();
  };

  const handleSubmit= async () => {
    let datum: any = {};
    if(fname!==userData.fullname && fname!==''){
      Object.assign(datum, {'fullname': fname})
    }
    if (cropper.getCroppedCanvas() !== null) {
      Object.assign(datum, {'foto': cropper.getCroppedCanvas().toDataURL()})
    }
    if(Helper.isEmptyObj(datum)){
      addToast("Tidak ada perubahan.", {
          appearance: 'error',
          autoDismiss: true,
      })

    }else{
      await handlePut(Api.apiClient + `member/${userData.id}`, datum, async (datum) => {
        addToast(datum.msg, {
            appearance: 'success',
            autoDismiss: true,
        })
   
        await handleGet(Api.apiClient+`member/get/${userData.id}`,(datum)=>{
          const usr=Object.assign(userData,[],{'fullname':datum.fullname,foto:datum.foto})
          Sess.setUser(usr)
          toggleModal();
          router.reload()
        })
      });
    }
  };

  return (
    <Modal isOpen={open} onClose={toggleModal}>
      <form>
        <ModalBody>
          <div className="w-full items-center justify-items-center p-0">
            {/* Edit Profile */}
            <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg">
              
              <div className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-gray-200 leading-8 mb-3">
                <span className="text-old-gold-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">Edit Profile</span>
              </div>
              <div className="grid grid-cols-1">
                <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Nama Lengkap</span>
                    <input
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      name="fullname"
                      value={fname}
                      onChange={(event)=>setFname(event.target.value)}
                      placeholder="Nama Lengkap"
                    />
                  </label>
                <div>
                  <label className="block my-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Foto</span>
                    <input
                      type="file"
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      name="foto"
                      onChange={(e) => onChange(e)}
                    />
                  </label>
                  <div className="flex w-full h-52 relative bg-white">
                    <Cropper
                      initialAspectRatio={1}
                      aspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={1}
                      guides={true}
                      minCropBoxHeight={10}
                      minCropBoxWidth={10}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false} 
                      onInitialized={(instance:any) => {
                        setCropper(instance);
                      }}
                    />
                  </div>
                    <span className="text-gray-700 dark:text-gray-400 text-xs mt-2">Silahkan geser kekiri/kekanan atau zoom-in/zoom-out untuk menyesuaikan gambar dengan area kotak.</span>
                  
                </div>
              </div>
            </div>
            {/* End of Edit Profile grid */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={toggleModal}>
            Batal
          </Button>
          <Button className="bg-old-gold hover:bg-old-gold-600 w-full sm:w-auto" onClick={handleSubmit}>
            Simpan Perubahan
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ModalProfile;
