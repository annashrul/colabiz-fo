import React, { useEffect, useState } from "react";
import "react-intl-tel-input/dist/main.css";
import atob from 'atob';
import Layout from 'Layouts'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import nookies from 'nookies'
import { NextPageContext } from 'next'
import ProfileCard from "components/genealogy/ProfileCard";
import { arrayToTree } from "performant-array-to-tree";
import { handleGet } from "lib/handleAction";
import { iNetwork, iUser } from "lib/interface";
import httpService from "lib/httpService";
import moment from "moment";
import { useToasts } from "react-toast-notifications";
interface iIndexGenealogy {
  userData: iUser;
}

const Index: React.FC<iIndexGenealogy> = ({userData}) =>{
  
  const [datumNetwork,setDatumNetwork]= useState<Array<iNetwork>>([]);
  useEffect(() => {
    loadNetwork(`isfirst=true`,btoa(userData.referral));
}, []);


const loadNetwork = async (val: string, id:string) => {
    let url = Api.apiClient+`member/network/${id}`;
    if(val!==null){
        url+=`?${val}`;
    }
    await handleGet(url,(datum)=>{
        setDatumNetwork(datum);
    })
   
}
  const { addToast } = useToasts();
    const doMore = async (val:string)=>{
      let url = Api.apiClient+`member/network/${btoa(val)}`;
      await handleGet(url,(datum)=>{
        if(datum.length>0){
          setDatumNetwork(datumNetwork.concat(datum));
        } else {
          addToast("Jaringan untuk "+val+" tidak ada!", {appearance: 'warning',autoDismiss: true});
        }
      })
    }
    return (
      <Layout title="Genealogy">
        <div className="container mt-6 lg:px-6 md:px-3 mx-auto xs:px-2 sm:px-2 grid mb-20">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Genealogy
          </h2>
          {/* component */}
          <div className="flex flex-col justify-center items-center">
            <div className="">
              <div className="items-center justify-center flex">
                {datumNetwork && datumNetwork?.length>0?arrayToTree(datumNetwork?.length>0?datumNetwork:[],{ dataField: null, childrenField: "children"  }).map((res, idX) => (
                  <ProfileCard
                    key={idX}
                    {...res}
                    id={String(res.id)}
                    name={res.name}
                    picture={res.picture}
                    hasChild={res.hasChild}
                    join_date={moment(res.join_date).format('YYYY-MM-DD')}
                    res={res.children}
                    callBack={(val)=>doMore(val)}
                     />
                )):<img src={`${httpService.noData}`}/>}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
}
export async function getServerSideProps(ctx:NextPageContext) {
    const cookies = nookies.get(ctx)
    const userData = JSON.parse(atob(cookies.__uid));
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

    return { 
      props:{
        userData
      }
    }
}


export default Index;