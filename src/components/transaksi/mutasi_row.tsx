

import React from 'react';
import Helper from 'lib/helper';

interface iMutasi {
    kd_trx:string;
    note:string;
    created_at:string;
    trx_in:string;
    trx_out:string;
}
const Mutasi: React.FC<iMutasi> = ({kd_trx,note,created_at,trx_in,trx_out}) => {

  return (
    <div className="w-full mb-4 mx-auto border-t border-b border-r rounded">
        <div className="p-2 border-l-4 border-teal rounded flex justify-between">
            <div>
                <div className="m-2 text-sm font-bold text-gray-700 dark:text-gray-400">{kd_trx}</div>
                <div className="m-2 pb-2 text-xs text-gray-700 dark:text-gray-400 border-b-2 border-grey-lighter">
                    {note}
                </div>
                <div className="m-2 text-xs font-semibold text-gray-700 dark:text-gray-400">{Helper.formatDate(created_at,true)}</div>
            </div>
            <div>
                <div className="text-right m-2 text-xs font-semibold text-green-200">+ {Helper.numFormat(trx_in)}</div>
                <div className="text-right m-2 text-xs font-semibold text-orange-200">- {Helper.numFormat(trx_out)}</div>
            </div>
        </div>
    </div>
  );
};




export default Mutasi;
