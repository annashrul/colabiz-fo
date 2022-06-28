import React, { useState, useEffect} from "react";
import "react-intl-tel-input/dist/main.css";
import Layout from 'Layouts'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import {iWithdrawal,iPagin} from 'lib/interface';
import { Pagination } from '@windmill/react-ui'
import moment from 'moment'
import { NextPageContext } from 'next'
import { } from '@windmill/react-ui'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { handleGet } from "lib/handleAction";
import nookies from 'nookies'
import httpService from "lib/httpService";

interface iReportWithdrawal { datum:any}

const ReportWithdrawal: React.FC<iReportWithdrawal> = (datum) =>{
    const [arrDatum,setArrDatum]= useState<Array<iWithdrawal>>([]);
    const [arrData,setArrData]= useState<iPagin>();
    const [any, setAny] = useState("");
        const [hitFirst,setHitFirst]=useState(1);

    const [datefrom,setDatefrom]=useState(moment(new Date()).format("MM/DD/yyyy"));
    const [dateto,setDateto]=useState(moment(new Date()).format("MM/DD/yyyy"));

    useEffect(() => {
         setArrDatum(datum.datum.data);
        setArrData(datum.datum);
        // handleLoadData(`page=1&datefrom=${moment(datefrom).format('YYYY-MM-DD')}&dateto=${moment(dateto).format('YYYY-MM-DD')}&perpage=10`);
    }, []);
   
    const handleLoadData = async(val:string)=>{
        let url = Api.apiClient+`transaction/withdrawal`;
        if(val!==null){
            url+=`?${val}`;
        }
        await handleGet(url,(datum)=>{
            setArrDatum(datum.data);
            setArrData(datum);
        })
    }

    const handleSearch=()=>{
        handleLoadData(`page=1&q=${btoa(any)}`);
    }
    const handlePage=(pagenum:number)=>{
        if(hitFirst===0) handleLoadData(`page=${pagenum}&datefrom=${moment(datefrom).format('YYYY-MM-DD')}&dateto=${moment(dateto).format('YYYY-MM-DD')}&perpage=10`);

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
        <Layout title="Riwayat Penarikan">
            <div className="container mt-6 lg:px-7 mx-auto grid mb-20">
                <div className="flex justify-between">
                    <div>
                        <h2 className="mt-6 text-2xl align-middle font-semibold text-gray-700 dark:text-gray-200">
                            Riwayat Penarikan
                        </h2>
                       
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto"></div>
                        <div className="shadow-md rounded my-6">
                            <div className={"mt-4 flex"}>
                                <DateRangePicker onApply={handleEvent}>
                                    <input type="text" readOnly={true} className="block w-full mt-1 px-3 text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none  dark:text-gray-300 div-input" value={`${datefrom} - ${dateto}`}/>
                                </DateRangePicker>

                                <input 
                                className="block w-full mt-1 px-3 text-sm dark:border-gray-600 dark:bg-gray-700 focus:outline-none  dark:text-gray-300 div-input" 
                                placeholder="tulis kode trx atau catatan disini" 
                                value={any}
                                onChange={(event)=>setAny(event.target.value)}
                                onKeyPress={event=>{if(event.key==='Enter'){handleSearch();}}}
                                />
                                <button 
                            className="px-8 rounded-r-lg bg-old-gold  text-gray-800 font-bold p-3 mt-1 uppercase border-yellow-500 border-t border-b border-r"
                            onClick={(event)=>{event.preventDefault();handleSearch()}}
                            >
                            <svg className="text-gray-200 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966"  xmlSpace="preserve" width="512px" height="512px">
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                            </svg>
                        </button>
                            </div>
                            <br/>
                            <div className="w-full overflow-hidden rounded-lg shadow-xs mb-8">
                            <div className="w-full overflow-x-auto">
                                <table className="w-full whitespace-no-wrap">
                                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                                    {
                                        arrDatum?.length>0?arrDatum.map((item:iWithdrawal,i:number)=>{
                                            let stts;

                                            if(item.status===0){
                                                stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-purple-700 bg-purple-100 dark:text-white dark:bg-purple-600">Pending</span>
                                            }else if(item.status===1){
                                                stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100">Berhasil</span>
                                            }else{
                                                stts=<span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600">Gagal</span>
                                            }
                                            return (
                                                <tr key={i} className={i%2===0?`bg-gray-700`:''}>
                                                    <td className="py-3 px-6 text-center">{i+1 + (10 * (arrData===undefined?0:arrData.current_page-1))}</td>
                                                    <td className="py-3 px-6 text-left text-sm"><span className="text-white">{item.kd_trx}</span> <br/> {item.fullname}</td>
                                                    <td className="py-3 px-6 text-left text-sm">{item.bank_name} <br/>{item.acc_name} - ( <span className="text-sm">{item.acc_no}</span> )</td>
                                                    <td className="py-3 px-6 text-right text-old-gold-700"><span className="text-gray-400 text-xs">Penarikan:</span> <br/>{Helper.numFormat(item.amount)}</td>
                                                    <td className="py-3 px-6 text-right text-red-600"><span className="text-gray-400 text-xs">Charge:</span> <br/>{Helper.numFormat(item.charge)}</td>
                                                    <td className="py-3 px-6 text-right">{stts}<br/>{Helper.formatDate(item.created_at,true)}</td>
                                                </tr>

                                            )
                                        }) : <tr><td colSpan={7}><img src={ httpService.noData}/></td></tr>

                                    }
                                </tbody>
                                </table>
                            </div>
                        </div>


                        <br/>
                        <Pagination
                            totalResults={arrData===undefined?0:arrData.total}
                            resultsPerPage={arrData===undefined?0:arrData.per_page}
                            onChange={(val) => {setHitFirst(0);handlePage(val)}}
                            label="Page navigation"
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
export async function getServerSideProps(ctx:NextPageContext) {
    const cookies = nookies.get(ctx)
    if(!cookies._prowara){
        return {redirect: {destination: '/auth/login',permanent: false}}
    }else{
        Api.axios.defaults.headers.common["Authorization"] = Helper.decode(cookies._prowara);
    }
    let datum=[];
  try {
      const getData = await Api.get(Api.apiUrl +`transaction/withdrawal?page=1&datefrom=${moment(new Date()).format('YYYY-MM-DD')}&dateto=${moment(new Date()).format('YYYY-MM-DD')}`);
    if(getData.status===200){
        datum = getData.data.result;
    }else{
      datum=[];
    }
  } catch (err) {
        

  }
    return { 
        props:{datum}
    }
}

export default ReportWithdrawal;