import React from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'

import Report from 'components/Dashboard/report'
import Berita from 'components/Dashboard/Berita'
import Widget from 'components/Dashboard/Card';
import Slot from 'components/Dashboard/Slot';
import Statistic from 'components/Dashboard/statistic'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import {iContent, iTransaksi, iWidget} from 'lib/interface';
import { handleGet } from 'lib/handleAction';

interface iDashboard{
  widget:iWidget;
  berita:Array<iContent>;
  report:Array<iTransaksi>;
  bonus:Array<iTransaksi>;
}

const Dashboard: React.FC<iDashboard> = ({widget,berita,report,bonus}) => {

  return (
      <Layout title="Dashboard">
        <div className="container mt-6 lg:px-6 md:px-3 mx-auto xs:px-2 sm:px-2 grid mb-20">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Dashboard
          </h2>
          {/* CARD SECTION */}
          <Widget
            c1={`${Helper.numFormat(`${widget.saldo}`)}`}
            c2={widget.total_pin + " Tiket"}
            c3={`${Helper.numFormat(`${widget.modal}`)}`}
            c4={`${widget.sponsor}`}
          />

          {/* SLOT SECTION */}
          <Slot/>
          
          {/* JUMLAH MEMBER */}
          <Statistic jumlah={widget.total_member}/>

          {/* BOTTOM SECTION */}
            <div className="mt-8 sm:mt-0 sm:w-full flex flex-col md:flex-row justify-between gap-4">
              <Report
                title="Profit Harian"
                show={false}
                dataReport={bonus}/>
              <Report 
                title="Mutasi Poin Terbaru" 
                show={true}
                dataReport={report}/>
              <Berita dataBerita={berita}/>
            </div>
        </div>
      </Layout>
  );
}


export async function getServerSideProps(ctx:NextPageContext) {
  // Parse
  const cookies = nookies.get(ctx)
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

    // GET BANK DATA
  let datum=[];
  try {
    const getData = await Api.get(Api.apiUrl+"site/memberarea")
    if(getData.status===200){
      datum=getData.data.result;
    }else{
      datum=[];
    }
  } catch (err) {}

  let berita:any=[];
  await handleGet(Api.apiUrl+'content/berita',(res)=>{
    if(res.data!==undefined) berita=res.data;
  },false)

  let report:any=[];
  await handleGet(Api.apiUrl+'transaction/history?page=1',(res)=>{
    report=res.data;
  },false)

  let bonus:any=[];
  await handleGet(Api.apiUrl+'transaction/history?page=1&q=U2hhcmluZyBQcm9maXQgZGFyaSA=',(res)=>{
    bonus=res.data;
  },false)

  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { props:{
      cookies,
      widget:datum,
      berita,
      report,
      bonus
    }
  }
}

export default Dashboard
