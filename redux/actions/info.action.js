import { CONFIG, INFO, PIN } from "../type";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import authAction from "../../action/auth.action";
import { message, Message } from "antd";
import Router from "next/router";
import { getGenealogyAction } from "./member.action";

export const setLoadingConfig = (load) => {
  return {
    type: CONFIG.LOADING_CONFIG,
    load,
  };
};
export const setLoading = (load) => {
  return {
    type: INFO.LOADING,
    load,
  };
};
export const setDataConfig = (data) => {
  return {
    type: CONFIG.DATA_CONFIG,
    data,
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

export const aktivasiPinAction = (data, callback) => {
  return (dispatch) => {
    dispatch(setLoadingPinAktivasi(true));
    handlePost("pin/aktivasi/register", data, (res, status, msg) => {
      dispatch(setLoadingPinAktivasi(false));
      if (status) {
        message.success(msg);
      }
      if (callback !== undefined) {
        callback();
      } else {
        dispatch(getInfoAction());
      }
    });
  };
};
export const happyShoppingPinAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingPinHappyShopping(true));
    handlePost("pin/aktivasi/hs", data, (res, status, msg) => {
      dispatch(setLoadingPinHappyShopping(false));
      if (status) {
        dispatch(getInfoAction());
        message.success(msg);
      }
    });
  };
};

export const getInfoAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet("site/info", (res, status) => {
      dispatch(setData(res.data));
      dispatch(setLoading(false));
    });
  };
};

export const getConfigAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoadingConfig(true));
    handleGet("site/config", (res, status) => {
      console.log("config action", res);
      dispatch(setDataConfig(res.data));
      dispatch(setLoadingConfig(false));
    });
  };
};
