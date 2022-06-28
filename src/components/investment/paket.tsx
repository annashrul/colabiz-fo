
import React from 'react';
import Helper from 'lib/helper'
import {iPaket} from 'lib/interface'
import Skeleton from 'components/Common/Skeleton'
import { useToasts } from 'react-toast-notifications'


interface iCards {
    selected?: Boolean;
    loading:Boolean;
    handleClick: (id:string) => void;
    datum:iPaket;
    isActive?:boolean;
}
const Cards: React.FC<iCards> = ({selected,loading,handleClick,datum,isActive=true}) => {
    const { addToast } = useToasts();
    const load=[];
    for(let i=0;i<4;i++){
        load.push(
            <div className="flex shadow-2xl h-40 w-full md:min-w-96">
                    <div className=" md:w-1/2">
                        <Skeleton style="h-full w-full  object-cover rounded-lg rounded-r-none pb-5/6 border border-gray-200  border-r-0"/>
                    </div>
                    <div className="w-full md:w-2/3 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200  border-l-0 rounded-lg rounded-l-none text-left ">
                        <div className="flex flex-col">
                            <h2 className="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 font-medium mr-auto "></h2>
                            <div className="flex flex-row justify-between">
                                <Skeleton style="w-1/3 h-4 "/>
                                <Skeleton style="w-1/4 h-4"/>
                            </div>
                        </div>
                        <p className=" mt-5">
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                        </p>
                    </div>
                </div>
        )
    }
  return (
      <>
      {
          loading?load
          :(
                <button onClick={(event)=>{event.preventDefault();!isActive?addToast("Paket tidak tersedia! Silahkan pilih paket yang lain.", {appearance: 'error',autoDismiss: true}):handleClick(datum?.id)}} className="focus:outline-none">
                    <div className="flex shadow-2xl h-30 lg:h-40 w-full">
                        <img className={"md:h-full w-1/3 md:w-1/3 object-scale-down	 rounded-lg rounded-r-none pb-5/6 "+(selected?"border-4 border-old-gold  border-r-0":(!isActive?"border-4 cursor-not-allowed border-base-red-800  border-r-0":"border-4 border-gray-200  border-r-0"))} loading="lazy" src={datum?.gambar} alt="bag" />
                        <div className={"w-full md:w-2/3 px-4 py-1 bg-white dark:bg-gray-700 rounded-lg rounded-l-none text-left "+(selected?"border-4 border-old-gold  border-l-0":(!isActive?"border-4 cursor-not-allowed border-base-red-800  border-l-0":"border-4 border-gray-200  border-l-0"))}>
                            <div className="flex flex-col">
                                <h2 className="text-xl text-gray-700 dark:text-gray-200 font-medium mr-auto">{datum?.title}</h2>
                                <div className="flex flex-row justify-between">
                                    <p className="text-gray-700 dark:text-gray-200 text-lg font-semibold tracking-tighter flwx-grow">
                                        {Helper.numFormat(`${datum?.price}`)}
                                    </p>
                                    <span className="flex-grow-0  inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-old-gold-100 bg-old-gold-600 rounded">{datum?.pin_required} Tiket</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
                                {((datum?.caption.replace(/<[^>]*>?/gm, '')).replace(/&nbsp;/g, '')).substr(0,120)}
                            </p>
                        </div>
                    </div>
                </button>

          )
      }
      </>
  );
};
export default Cards;
