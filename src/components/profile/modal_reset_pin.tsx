import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import { handlePut } from 'lib/handleAction';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

interface iModalResetPin {
  open: boolean;
  closeModal: () => void;
  userData: any;
}
type FormValues = {
  pin_old: string;
  pin: string;
  pin_re: string;
};
const ModalResetPin: React.FC<iModalResetPin> = ({ open, closeModal, userData }) => {
  const { register, handleSubmit } = useForm<FormValues>();
  const { addToast } = useToasts();
  const [hidePinOld, setHidePinOld] = useState(true);
  const [hidePin, setHidePin] = useState(true);
  const [hidePinRe, setHidePinRe] = useState(true);

  const toggleModal = () => {
    closeModal();
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let datum: any = {
      pin: data.pin,
      pin_member: data.pin_old,
      pin_re: data.pin_re,
    };

    if (datum.pin_member === '') {
      addToast('PIN Lama tidak boleh kosong!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin_member).length < 6) {
      addToast('PIN Lama kurang dari 6 digit!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin_member).replace(/[0-9]/g, '') === null) {
      addToast('PIN Lama harus berupa digit angka!', { appearance: 'error', autoDismiss: true });
    } else if (datum.pin === '') {
      addToast('PIN Baru tidak boleh kosong!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin).length < 6) {
      addToast('PIN Baru kurang dari 6 digit!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin).replace(/[0-9]/g, '') === null) {
      addToast('PIN Baru harus berupa digit angka!', { appearance: 'error', autoDismiss: true });
    } else if (datum.pin_re === '') {
      addToast('Ulangi PIN Baru tidak boleh kosong!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin_re).length < 6) {
      addToast('Ulangi PIN Baru kurang dari 6 digit!', { appearance: 'error', autoDismiss: true });
    } else if (String(datum.pin_re).replace(/[0-9]/g, '') === null) {
      addToast('Ulangi PIN Baru harus berupa digit angka!', { appearance: 'error', autoDismiss: true });
    } else if (datum.pin !== datum.pin_re) {
      addToast('Ulangi PIN Baru tidak sesuai!', { appearance: 'error', autoDismiss: true });
    } else {
      await handlePut(Api.apiClient + `member/${userData.id}`, datum, () => {
        Helper.mySwalWithCallback("PIN Transaksi anda telah berhasil diganti.", () => {
          toggleModal();
        });
      });
    }
  };

  return (
    <Modal isOpen={open} onClose={toggleModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="w-full items-center justify-items-center p-0">
            {/* Edit Profile */}
            <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-gray-200 leading-8 mb-3">
                <span className="text-old-gold-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-shield-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z" />
                  </svg>
                </span>
                <span className="tracking-wide">Edit PIN</span>
              </div>
              <div className="grid grid-cols-1">
                <div>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">PIN Lama</span>
                    <div className="relative">
                      <input
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        name="pin_old"
                        pattern="[0-9]*"
                        type={hidePinOld ? 'password' : 'text'}
                        maxLength={6}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        ref={register({ required: false, maxLength: 6 })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePinOld ? 'block' : 'none' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePinOld(false);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                          ></path>
                        </svg>
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePinOld ? 'none' : 'block' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePinOld(true);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">PIN Baru</span>
                    <div className="relative">
                      <input
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        name="pin"
                        pattern="[0-9]*"
                        type={hidePin ? 'password' : 'text'}
                        maxLength={6}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        ref={register({ required: false, maxLength: 6 })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePin ? 'block' : 'none' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePin(false);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                          ></path>
                        </svg>
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePin ? 'none' : 'block' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePin(true);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </label>
                  <label className="block mt-4 text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Ulangi PIN Baru</span>
                    <div className="relative">
                      <input
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        name="pin_re"
                        pattern="[0-9]*"
                        type={hidePinRe ? 'password' : 'text'}
                        maxLength={6}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        ref={register({ required: false, maxLength: 6 })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePinRe ? 'block' : 'none' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePinRe(false);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                          ></path>
                        </svg>
                        <svg
                          className="h-6 text-gray-200 cursor-pointer"
                          fill="none"
                          style={{ display: hidePinRe ? 'none' : 'block' }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                          onClick={(e) => {
                            e.preventDefault();
                            setHidePinRe(true);
                          }}
                        >
                          <path
                            fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </label>
                </div>
                {/* <div className="col-span-2">
                  
                </div> */}
              </div>
            </div>
            {/* End of Edit Profile grid */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={toggleModal}>
            Batal
          </Button>
          <Button className="bg-old-gold hover:bg-old-gold-600 w-full sm:w-auto" type="submit">
            Simpan Perubahan
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ModalResetPin;
