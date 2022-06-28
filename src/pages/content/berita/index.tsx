import React, { useState, useEffect} from "react";
import Layout from 'Layouts'

import Api from 'lib/httpService';
import {iContent} from 'lib/interface';
import { handleGet } from 'lib/handleAction';
import Link from 'next/link'

interface iBerita{}

const ListBerita: React.FC<iBerita> = () => {
    const [arrDatum,setArrDatum]= useState<Array<iContent>>([]);
    useEffect(() => {
        handleLoadData(`page=1`);
    }, []);
   
    const handleLoadData = async(val:string)=>{
        let url = Api.apiClient+`content/berita`;
        if(val!==null){
            url+=`?${val}`;
        }
        await handleGet(url,(datum)=>{
            setArrDatum(datum.data);
        })

    }
  return (
      <Layout title="Berita">
        <div className="container mt-6 lg:px-6 md:px-3 mx-auto xs:px-2 sm:px-2 grid mb-20">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Berita
          </h2>
          {/* CARD SECTION */}
                {
                    arrDatum?.length>0?arrDatum.map((item:iContent,i:number)=>{
                        return(
                            <div key={i} className="bg-gray-800 w-128 mb-5 h-60 rounded shadow-md flex card text-grey-darkest">
                                <img className="w-1/2 h-full rounded-l-sm" src={item.picture} alt="Room Image"  />
                                <div className="w-full flex flex-col">
                                    <div className="p-4 pb-0 flex-1">
                                        <h3 className="font-light mb-1 text-gray-200">{item.category}</h3>
                                        <span className="text-5lg text-gray-200">{item.title}</span>
                                        <div className="flex items-center mt-4">
                                            <div className="pr-2 text-xs text-gray-300">
                                            <div dangerouslySetInnerHTML={{__html: item.caption.length>600?item.caption.substr(0,600)+'..':item.caption}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/content/berita/${item.id}`}>
                                        <div className="cursor-pointer text-white bg-grey-lighter p-3 flex items-center justify-between transition hover:bg-grey-light">
                                            Selengkapnya
                                            <span className="text-white">→</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                        );
                    }):"tidak ada data"
                }
        </div>
      </Layout>
  );
}


export default ListBerita;