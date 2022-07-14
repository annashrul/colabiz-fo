import { INFO, PIN } from "../type";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import authAction from "../../action/auth.action";
import { Message } from "antd";
import Router from "next/router";

export const setLoading = (load) => {
  return {
    type: INFO.LOADING,
    load,
  };
};

export const setData = (data) => {
  return {
    type: INFO.DATA,
    data,
  };
};

export const setLoadingPinAktivasi = (load) => {
  return {
    type: PIN.LOADING_AKTIVASI,
    load,
  };
};

export const setLoadingPinHappyShopping = (load) => {
  return {
    type: PIN.LOADING_AKTIVASI_HAPPY_SHOPPING,
    load,
  };
};

export const setLoadingPinSmartContract = (load) => {
  return {
    type: PIN.LOADING_AKTIVASI_SMART_CONTRACT,
    load,
  };
};

export const aktivasiPinAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingPinAktivasi(true));
    handlePost("pin/aktivasi/register", data, (res, status) => {
      dispatch(setLoadingPinAktivasi(false));
      if (status) {
        dispatch(getInfoAction());
      }
    });
  };
};

export const getInfoAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet("site/info", (res, status) => {
      dispatch(setData(res.data));
      console.log("info", res);
      dispatch(setLoading(false));
    });
  };
};
