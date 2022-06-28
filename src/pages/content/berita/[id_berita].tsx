import React from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'

import Api from 'lib/httpService'
import Helper from 'lib/helper';
import { iContent } from 'lib/interface';
import moment from 'moment'

interface iInvoice{
    kode:string;
    datum:iContent
}   

const DetailBerita: React.FC<iInvoice> =({datum})=> {
    return (
    <Layout title={`Invoice`}>
        <div className="container mt-6 lg:px-6 md:px-3 mb-10">
           
            <div className="flex">
                <div className="rounded w-full mt-8 min-h-0 bg-gray-800">
                    <img className="w-full bg-contain" src={datum.picture}/>
                    <div className="px-3 pb-2">
                        <div className="mt-5 mb-5 border-b-8 pb-5">
                            <span className="text-xl text-white font-bold mb-5">{datum.title}</span><br/>
                            <span className="text-md text-gray-200 font-medium">{moment(datum.created_at).format('YYYY-MM-DD hh:mm')}   </span>
                            <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600">{datum.category}</span>
                        </div>
                        <div className="pt-1">
                            <div className="mb-2 text-md text-gray-300" style={{textAlign:"justify"}}>
                                <div dangerouslySetInnerHTML={{__html: datum.caption}}></div>
                            </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
            </div>
            
        </Layout>
    );
}



export async function getServerSideProps(ctx:NextPageContext) {
    // Parse
    const cookies = nookies.get(ctx)
    const { id_berita } = ctx.query;
    // const decodeKode = Helper.decode(id_berita as string);

    if(!cookies._prowara){
        return {
        redirect: {
            destination: '/auth/login',
            permanent: false,
        },
        }
    }else{
        Api.axios.defaults.headers.common["Authorization"] = Helper.decode(cookies._prowara);
    }

    let datum:any=[];
   

    try {
        const getDetail = await Api.get(Api.apiUrl+"content/get/"+id_berita)
        if(getDetail.status===200){
            datum=getDetail.data.result;
        }else{
            datum=[];
        }
    } catch (err) {
    }



    return { 
        props:{
            kode:id_berita,
            datum
        }
    }
}

export default DetailBerita;