import React, { useState, useEffect } from "react";
import "react-intl-tel-input/dist/main.css";
import Layout from 'Layouts'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import {iMutasiTiket,iPagin} from 'lib/interface';
import { Pagination } from '@windmill/react-ui'
import moment from 'moment'
import { NextPageContext } from 'next'
import { } from '@windmill/react-ui'
import { handleGet } from "lib/handleAction";
import nookies from 'nookies'
import 'bootstrap-daterangepicker/daterangepicker.css';
import httpService from "lib/httpService";
import atob from 'atob';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
interface iMutTiket {
    datum: any;
    userData:string
}


const MutasiTiket: React.FC<iMutTiket> = ({datum,userData}) =>{
    const [arrDatum,setArrDatum]= useState<Array<iMutasiTiket>>([]);
    const [arrData, setArrData] = useState<iPagin>();
    const [hitFirst, setHitFirst] = useState(1);
        const [datefrom,setDatefrom]=useState(moment(new Date()).format("MM/DD/yyyy"));
    const [dateto,setDateto]=useState(moment(new Date()).format("MM/DD/yyyy"));
    const [any,setAny]=useState("");
    useEffect(() => {
        setArrDatum(datum.data);
        setArrData(datum);
    }, []);
   
    const handleLoadData = async(val:string)=>{
        let url = Api.apiClient+`member/pin/${userData}`;
        if(val!==null){
            url+=`?${val}`;
        }
        await handleGet(url,(res)=>{
            setArrDatum(res.data);
            setArrData(res);
        });
    }

   
    const handlePage=(pagenum:number)=>{
        if(hitFirst===0)handleLoadData(`page=${pagenum}&perpage=10`);

    }
    const handleSearch = (val: string) => {
        if (val === '') {
            console.log("kosong")
            handleLoadData(`page=1&datefrom=${datefrom}&dateto=${dateto}`);
            
        }
        else {
                        console.log("tidak kosong")

            handleLoadData(`page=1&datefrom=${datefrom}&dateto=${dateto}&jenis_transaksi=${val}`);
            
        }
        // handleLoadData(`page=1&jenis_transaksi=${any}`);
    }
     const handleEvent=(event:any,picker:any)=>{
        console.log(event);
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        setDatefrom(moment(picker.startDate._d).format('MM/DD/yyyy'));
        setDateto(moment(picker.endDate._d).format('MM/DD/yyyy'));
        handleLoadData(`page=1&datefrom=${from}&dateto=${to}&perpage=10`);
    }

    return (
        <Layout title="Riwayat Tiket">
            <div className="container grid  lg:px-6 mx-auto">
                <div className="flex justify-between">
                    <div>
                        <h2 className="mt-6 text-2xl align-middle font-semibold text-gray-700 dark:text-gray-200">
                            Riwayat Tiket
                        </h2>
                       
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="shadow-md rounded my-6">
                        <div className={"mt-4 flex "}>
                            <DateRangePicker onApply={handleEvent}>
                                <input type="text" readOnly={true} className="block w-full mt-1 px-3 text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none  dark:text-gray-300 div-input" value={`${datefrom} - ${dateto}`}/>
                            </DateRangePicker>

                            <select 
                                className="block w-full mt-1 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none  dark:text-gray-300 div-input" 
                                
                                value={any}
                                onChange={(event) => {
                                    event.preventDefault();
                                    setAny(event.target.value);
                                    handleSearch(event.target.value);
                                }}
                                // onKeyPress={event => { if (event.key === 'Enter') { handleSearch(''); } }}
                            >
                                <option value="">SEMUA</option>
                                <option value="POSTING">POSTING</option>
                                <option value="ORDER">ORDER</option>
                                <option value="CANCEL POSTING">CANCEL POSTING</option>
                                <option value="TRANSFER">TRANSFER</option>
                                <option value="TERIMA TIKET">TERIMA TIKET</option>
                            </select>
                            {/* <button 
                                className="px-8 rounded-r-lg bg-old-gold  text-gray-800 font-bold p-3 mt-1 uppercase border-yellow-500 border-t border-b border-r"
                                onClick={(event)=>{event.preventDefault();handleSearch()}}
                                >
                                <svg className="text-gray-200 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966"  xmlSpace="preserve" width="512px" height="512px">
                                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                                </svg>
                            </button> */}
                        </div>
                        <br/>
                        <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
                            <div className="w-full overflow-x-auto">
                                <table className="w-full whitespace-no-wrap">
                                    <thead>
                                        <tr className="text-xs font-semibold text-center tracking-wide text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                            <th className="px-4 py-3">No</th>
                                            <th className="px-4 py-3 text-left">Jenis Transaksi</th>
                                            <th className="px-4 py-3 text-left">Jumlah</th>
                                            <th className="px-4 py-3 text-left">Keterangan</th>
                                            <th className="px-4 py-3 text-left">Waktu</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                                    {
                                        arrDatum?.length>0?arrDatum.map((item:iMutasiTiket,i:number)=>{
                                            // let stts;

                                            // if(item.status_raw===0){
                                            //     stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600">Telah Diaktivasi</span>
                                            // }else if(item.status_raw===1){
                                            //     stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100">Tersedia</span>
                                            // }else if(item.status_raw===2){
                                            //     stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100">Posting</span>
                                            // }else{
                                            //     stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600">Transfer</span>
                                            // }
                                            return (
                                                <tr key={i} className={i%2===0?`bg-gray-700`:''}>
                                                    <td className="px-4 py-3  text-center">{i+1 + (10 * (arrData===undefined?0:arrData.current_page-1))}</td>
                                                    <td className="px-4 py-3  text-left">{item.jenis_transaksi}</td>
                                                    <td className="px-4 py-3  text-left">{item.jumlah+' Tiket'}</td>
                                                    <td className="px-4 py-3  text-left">{ item.note}</td>
                                                    <td className="px-4 py-3  text-left">{Helper.formatDate(item.created_at,true)}</td>
                                                </tr>

                                            )
                                        }) : <tr><td colSpan={5}><img src={`${httpService.noData}`}/></td></tr>

                                    }
                                </tbody>
                                </table>
                            </div>
                        </div>
                        <br />
                        {
                            arrDatum?.length>0?<Pagination
                            totalResults={arrData===undefined?0:arrData.total}
                            resultsPerPage={arrData===undefined?0:arrData.per_page}
                            onChange={(val) => { setHitFirst(0);handlePage(val)}}
                            label="Page navigation"
                        />:null
                        }
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export async function getServerSideProps(ctx:NextPageContext) {
    const cookies = nookies.get(ctx);
    const userData = JSON.parse(atob(cookies.__uid)).id;
    
    if(!cookies._prowara){
        return {redirect: {destination: '/auth/login',permanent: false}}
    }else{
        Api.axios.defaults.headers.common["Authorization"] = Helper.decode(cookies._prowara);
    }
    let datum = [];
    
  try {
      const getData = await Api.get(Api.apiUrl + `member/pin/${userData}?page=1`);
    if(getData.status===200){
        datum = getData.data.result;
    }else{
      datum=[];
      }
      
  } catch (err) {
        console.log("response mutasi tiket",err);

  }
    return { 
        props:{datum,userData}
    }
}

export default MutasiTiket;