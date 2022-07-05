import http from "./httpService";
import Cookies from "js-cookie";
import Helper from "../helper/general_helper";
import { STRING_COOKIES } from "../redux/type";

function setUser(datum) {
  Cookies.set(STRING_COOKIES.user, btoa(JSON.stringify(datum)), { expires: 7 });
}
function setBank(datum) {
  Cookies.set(STRING_COOKIES.bank, btoa(JSON.stringify(datum)), { expires: 7 });
}
function setAddress(datum) {
  Cookies.set(STRING_COOKIES.address, btoa(JSON.stringify(datum)), {
    expires: 7,
  });
}

function setToken(datum) {
  Cookies.set(STRING_COOKIES.token, btoa(datum), { expires: 7 });
}
export function doLogout() {
  Helper.removeCookie(STRING_COOKIES.info);
  Helper.removeCookie(STRING_COOKIES.user);
  Helper.removeCookie(STRING_COOKIES.token);
  http.axios.defaults.headers.common["Authorization"] = "";
}
function getUser() {
  const coo = Cookies.get(STRING_COOKIES.user);
  return JSON.parse(atob(coo));
}
function getBank() {
  const coo = Cookies.get(STRING_COOKIES.bank);
  return JSON.parse(atob(coo));
}
function getAddress() {
  const coo = Cookies.get(STRING_COOKIES.address);
  return JSON.parse(atob(coo));
}
function setInfo(datum) {
  Cookies.set(STRING_COOKIES.info, btoa(JSON.stringify(datum)));
}

function getInfo() {
  const coo = Cookies.get(STRING_COOKIES.info);
  if (coo !== undefined) {
    return JSON.parse(atob(coo));
  } else {
    return undefined;
  }
}

function getToken() {
  return Cookies.get(STRING_COOKIES.token);
}

export default {
  http,
  setBank,
  setAddress,
  getBank,
  getAddress,
  doLogout,
  setUser,
  getUser,
  getToken,
  setToken,
  setInfo,
  getInfo,
};
