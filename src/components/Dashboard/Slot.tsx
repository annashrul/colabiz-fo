
import React,{useEffect,useState} from 'react';
import { useToasts } from 'react-toast-notifications'

import Api from 'lib/httpService'
import Row from './Row_slot';
import {iSlot,iPagin} from 'lib/interface';
import { Pagination } from '@windmill/react-ui'
import {useRouter} from 'next/router'


interface iCards {
}

const Cards: React.FC<iCards> = () => {
  const router = useRouter()
  const { addToast } = useToasts();
  const [loading,setLoading] = useState(true);
  const [datumSlot,setDatumSlot]=useState<Array<iSlot>>();
  const [pagination,setPagination]=useState<iPagin>();

  useEffect(() => {
    getSlot(1);
	}, []);
  const getSlot= async (page:number)=>{
        setLoading(true)

        try {
        const getPaket=await Api.get(Api.apiClient+`site/slot?page=${page}`)
            setTimeout(
            function () {
                setLoading(false)

                // save token to localStorage
                if(getPaket.data.status==='success'){
                    const datum = getPaket.data.result;
                    setDatumSlot(datum.data);
                    setPagination(datum)
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
                setLoading(false)
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
  const handlePage=(pagenum:number)=>{
        getSlot(pagenum)
    }
  return (
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold text-center tracking-wide text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Modal</th>
                  <th className="px-4 py-3">Profit Harian</th>
              <th className="px-4 py-3">Dimulai pada</th>
                  <th className="px-4 py-3">Sisa Waktu</th>
              
                  <th className="px-4 py-3">MOU</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-center">
                {
                  loading?
                      <Row datum={({} as iSlot)} isLoading={true}/>
                      :

                        datumSlot===undefined?(
                            <tr>
                              <td colSpan={8}>
                                <div  className="text-center text-white p-4 text-md">
                                  Anda belum mempunyai paket aktif, silahkan <button className="text-old-gold-100 bg-old-gold-600 p-1 rounded-lg" onClick={()=>router.push("/investment/create")}>Beli Paket</button> terlebiih dahulu.
                                </div>
                              </td>
                            </tr>
                        ):
                        datumSlot?.map((item:iSlot)=>{
                          return(
                            <Row datum={(item as iSlot)} isLoading={false}/>
                          )
                        })
                }

       
              </tbody>
            </table>
          </div>
          <div className={"mt-3 "+(datumSlot===undefined?"hidden":'block')}>
            <Pagination
                totalResults={pagination===undefined?0:pagination.total}
                resultsPerPage={pagination===undefined?0:pagination.per_page}
                onChange={handlePage}
                label="Page navigation"
            />
          </div>
        </div>
  );
};
export default Cards;
