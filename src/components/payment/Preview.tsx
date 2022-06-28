import React from 'react';
import {iRegist} from 'lib/interface'
import Helper from 'lib/helper';

interface iCards {
    datum:iRegist;
}
const Cards: React.FC<iCards> = ({datum}) => {
  return (
      <div className='w-full flex flex-col lg:flex-row'>
        <div className="w-full flex items-center justify-items-center content-center text-center pr-0 lg:pr-10">
                <table className="w-full whitespace-no-wrap">
                <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3 text-center text-lg" colSpan={2} rowSpan={2}>Detail Member</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">Nama  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.fullname}</td>
                    </tr>
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">Sponsor  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.sponsor}</td>
                    </tr>
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">No. Hp  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.mobile_no}</td>
                    </tr>
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">No. KTP (NIK)  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.nik}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div className="w-full flex items-center justify-items-center content-center text-center  pl-0 lg:pl-10 mt-5 lg:mt-0">
                <table className="w-full whitespace-no-wrap">
                <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3 text-center text-lg" colSpan={2} rowSpan={2}>Detail Paket</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">Paket  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.datumPaket.title}</td>
                    </tr>
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">Tiket terpakai  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{datum.datumPaket.pin_required} Tiket</td>
                    </tr>
                    <tr className="text-gray-500 dark:text-gray-400">
                        <td className="px-2 py-3 text-base">Harga  :</td>
                        <td className="px-2 py-3 text-left ml-10 text-base">{Helper.numFormat(datum.datumPaket.price)}</td>
                    </tr>
                </tbody>
                </table>
        </div>
        </div>
  );
};
export default Cards;
