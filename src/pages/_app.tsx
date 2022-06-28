import { AppProps } from 'next/app'
import Router from 'next/router';
import 'tailwindcss/tailwind.css'
import '../styles/styles.css'
import '../styles/font-awesome.min.css'
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { Windmill } from '@windmill/react-ui'
import { ToastProvider } from 'react-toast-notifications';
import axios from 'axios';
import LogRocket from 'logrocket';
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {doLogout} from 'lib/auth'


LogRocket.init('9razfl/prowara');
const coo:string=Cookies.get('_prowara')!;
if(coo!==undefined) {
  axios.defaults.headers.common["Authorization"] = atob(coo);
  // cek JWT Token
  const decodedToken:any = jwt_decode(atob(coo));
  const dateNow = new Date();
  if (decodedToken.exp * 1000 < dateNow.getTime()) {
    doLogout();
    // Redirect to login
    window.location.href = '/auth/login';
  }

}

axios.defaults.headers.common['username'] = `netindo`;
axios.defaults.headers.common['password'] = `$2b$08$hLMU6rEvNILCMaQbthARK.iCmDRO7jNbUB8CcvyRStqsHD4UQxjDO`;
axios.defaults.headers.common['myconnection'] = `apps`;
axios.defaults.headers.common['Content-Type'] = `application/x-www-form-urlencoded`;
//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Windmill dark>
            <ToastProvider
            autoDismiss
            autoDismissTimeout={2000}
            placement="bottom-right"
          >
            <Component {...pageProps} />
          </ToastProvider>
        </Windmill>;
}