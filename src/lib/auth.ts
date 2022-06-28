// import jwtDecode from "jwt-decode";
import http from "./httpService";
import Cookies from "js-cookie";
import {iUser} from './interface'
import Helper from "./helper";

// http.setJwt (getJwt());


function setUser(datum: iUser) {
  Cookies.set('__uid', btoa(JSON.stringify(datum)), { expires: 7 });
}

function setToken(datum: string) {
  Cookies.set('_prowara', btoa(datum), { expires: 7 });

}
export function doLogout() {
  Helper.removeCookie('__uid');
  Helper.removeCookie('_prowara');
  Helper.removeCookie('_regist');
  http.axios.defaults.headers.common["Authorization"] = '';

}

function getUser() {
  // const coo: string=Cookies.get('__uid')!;
  //  try {
  //    const datum:iUser= JSON.parse(atob(coo));
  //    return datum;
  // } catch (err) {
  //     // const datum:iUser= JSON.parse();
  //     return datum;
  // }
}

function getToken() {
  const coo: string=Cookies.get('_prowara')!;
  return coo;
}

export default {
  http,
  doLogout,
  setUser,
  getUser,
  getToken,
  setToken
};
