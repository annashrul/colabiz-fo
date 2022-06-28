import React from 'react';
import Layout from 'Layouts'
import { NextPageContext } from 'next'
import nookies from 'nookies'
import Api from 'lib/httpService';
import Helper from 'lib/helper';
import { useRouter } from 'next/router';


interface iDashboard{
  datum:string;
  deviceType:string;
}

const Dashboard: React.FC<iDashboard> = ({datum,deviceType}) => {
  const router = useRouter();
  React.useEffect(()=>{
    if(deviceType==='mobile') router.push(datum);
  },[])
  return (
      <Layout title="MoU Prowara">
        <div className="container mt-6 lg:px-6 md:px-3 mx-auto xs:px-2 sm:px-2 grid mb-20">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                MoU Prowara
            </h2>
            <object data={datum} type="application/pdf" width="100%" height="800px">
              <p className="my-6 text-lg font-semibold text-gray-700 dark:text-gray-200">Browser anda tidak mendukung plugin PDF.
              <br/>
              Unduh otomatis berjalan. Jika unduh otomatis tidak berjalan silahkan <a href={datum} className="text-old-gold-700 underline" target="_blank">klik disini untuk unduh manual.</a></p>
            </object>

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
    let userAgent;
    if (ctx) { // if you are on the server and you get a 'ctx' property from your context
      userAgent = ctx.req?.headers['user-agent'] // get the user-agent from the headers
    } else {
      userAgent = navigator.userAgent // if you are on the client you can access the navigator from the window object
    }
    let isMobile = Boolean(userAgent?.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))

    // GET BANK DATA
  let datum=[];
  try {
    const getData = await Api.get(Api.apiUrl+"site/mou")
    if(getData.status===200){
      datum=getData.data.result;
    }else{
      datum=[];
    }
  } catch (err) {}


  // Destroy
  // nookies.destroy(ctx, 'cookieName')

  return { props:{
      datum,
      deviceType: isMobile ? 'mobile' : 'desktop'

    }
  }
}

export default Dashboard