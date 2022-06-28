import React, { useEffect, useState } from 'react';
import 'react-intl-tel-input/dist/main.css';
import Layout from 'Layouts';
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import { handleGet } from 'lib/handleAction';
import { iUser } from 'lib/interface';
import moment from 'moment';
import helper from 'lib/helper';
// import { useToasts } from 'react-toast-notifications';
import { NextPageContext } from 'next';
import nookies from 'nookies';
import atob from 'atob';
import ModalProfile from 'components/profile/modal_profile';
import {Invest} from 'icons'
import { Badge } from '@windmill/react-ui';
import ModalResetPin from 'components/profile/modal_reset_pin';
interface iIndexProfile {
  userData: iUser;
}

const Index: React.FC<iIndexProfile> = ({ userData }) => {
  // const { addToast } = useToasts();
  const [openEditMember, setOpenEditMember] = useState(false);
  const [openEditPin, setOpenEditPin] = useState(false);
  const [memberArea, setMemberArea] = useState({ total_pin: '', saldo: '', modal: '', sponsor: '' });
  const [memberBank, setMemberBank] = useState({ acc_no: '', acc_name: '', bank_name: '', id: '' });
  useEffect(() => {
    loadMemberArea();
    loadMemberBank();
  }, []);
  const loadMemberArea = async () => {
    let url = Api.apiClient + `site/memberarea`;
    await handleGet(url, (datum) => {
      setMemberArea(datum);
    });
  };
  const loadMemberBank = async () => {
    let url = Api.apiClient + `bank_member?id_member=${userData.id}`;
    await handleGet(url, (datum) => {
      setMemberBank(datum.data[0]);
    });
  };
  return (
    <Layout title="Profile">
      <div className="md:flex no-wrap md:-mx-2 my-8">
        {/* Left Side */}
        <div className="w-full md:w-3/12 md:mx-2">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 p-3 border-t-4 border-old-gold-400 rounded-b-lg">
            <div className="image overflow-hidden">
              <img
                className="h-auto w-full mx-auto"
                src={userData.foto}
                onError={(e) => {
                  onerror = null;
                  e.currentTarget.src = 'https://dummyimage.com/302x302/94a3b8/ffffff';
                }}
              />
            </div>
            <div className="flex items-center py-3">
              <h1 className="text-gray-900 dark:text-gray-200 font-bold text-xl leading-8 my-1 mr-auto">
                {userData.fullname}
              </h1>
              <Badge
                className="cursor-pointer ml-auto"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditMember(true);
                }}
              >
                Edit
              </Badge>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-lg text-semibold leading-6">{userData.referral}</h3>

            <ul className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-lg">
              <li className="flex items-center py-3">
                <span>Status</span>
                {userData.status === 1 ? (
                  <span className="ml-auto">
                    <span className="bg-old-gold-500 py-1 px-2 rounded text-white text-sm">Active</span>
                  </span>
                ) : (
                  <span className="ml-auto">
                    <span className="bg-red-500 py-1 px-2 rounded text-white text-sm">Non-Active</span>
                  </span>
                )}
              </li>
              <li className="flex items-center py-3">
                <span>Member since</span>
                <span className="ml-auto">{moment(userData.created_at).format('LL')}</span>
              </li>
            </ul>

            <div className="block items-center pt-3">
              <h1 className="text-gray-900 dark:text-gray-200 font-bold text-xl leading-8 my-1 mr-auto">Keamanan</h1>
              <button
                className="px-8 bg-red-500 block w-full text-gray-200 font-bold p-1 mt-3 uppercase border-red-500 rounded-lg"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditPin(true);
                }}
              >
                Ubah PIN
              </button>
            </div>
          </div>
          {/* End of profile card */}
          <div className="my-4" />
        </div>
        {/* Right Side */}
        <div className="w-full md:w-9/12 mx-2 h-64">
          {/* Profile tab */}
          {/* About Section */}
          <div
            className="rounded-t-lg shadow-lg bg-gray-600 w-full flex flex-row flex-wrap p-3 antialiased h-36 bg-fixed"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1578836537282-3171d77f8632?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80")',
              backgroundRepeat: 'no-repat',
              backgroundSize: 'cover',
              backgroundBlendMode: 'multiply',
            }}
          ></div>

          <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg -mt-6">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-gray-200 leading-8">
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
              <span className="tracking-wide">Membership</span>
            </div>
            <div className="text-gray-700 dark:text-gray-200">
              <div className="grid md:grid-cols-2 text-sm">
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">Total Tiket</div>
                  <div className="px-4 py-2 font-semibold dark:text-old-gold-500">{memberArea.total_pin} Tiket</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">Saldo</div>
                  <div className="px-4 py-2 font-semibold dark:text-old-gold-500">
                    {helper.numFormat(`${memberArea.saldo}`)}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">Modal</div>
                  <div className="px-4 py-2 font-semibold dark:text-old-gold-500">{memberArea.modal}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="px-4 py-2">Sponsor</div>
                  <div className="px-4 py-2 font-semibold dark:text-old-gold-500">{memberArea.sponsor}</div>
                </div>
              </div>
            </div>
          </div>
          {/* End of about section */}
          {/* Bank section */}

          <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg mt-6">
            <div className="flex items-center space-x-2 font-semibold text-gray-900 dark:text-gray-200 leading-8">
              <span className="text-old-gold-500">
                {Invest}
              </span>
              <span className="tracking-wide">Bank Member</span>
            </div>
            <div className="text-gray-700 dark:text-gray-200">
              <div className="grid md:grid-cols-3 text-sm">
                <div className="grid grid-cols-1">
                  <div className="px-4 py-2 text-center">
                    Atas Nama
                    <br />
                    <span className="text-gray-700 dark:text-old-gold-500">{memberBank.acc_name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="px-4 py-2 text-center">
                    Nama Bank
                    <br />
                    <span className="text-gray-700 dark:text-old-gold-500">{memberBank.bank_name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div className="px-4 py-2 text-center">
                    No Rekening
                    <br />
                    <span className="text-gray-700 dark:text-old-gold-500">{memberBank.acc_no}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of bank section */}
          <div className="my-4" />
        </div>
      </div>
      <ModalProfile open={openEditMember} closeModal={() => setOpenEditMember(false)} userData={userData} />
      <ModalResetPin open={openEditPin} closeModal={() => setOpenEditPin(false)} userData={userData} />
    </Layout>
  );
};
export async function getServerSideProps(ctx: NextPageContext) {
  const cookies = nookies.get(ctx);
  const userData = JSON.parse(atob(cookies.__uid));
  if (!cookies._prowara) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  } else {
    Api.axios.defaults.headers.common['Authorization'] = Helper.decode(cookies._prowara);
  }

  return {
    props: {
      userData,
    },
  };
}

export default Index;
