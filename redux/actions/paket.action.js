import { PAKET } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";
import { StringLink } from "../../helper/string_link_helper";

export const setDataRegister = (data) => {
  return {
    type: PAKET.DATA_REGISTER,
    data,
  };
};

export const setDataSmartContract = (data) => {
  return {
    type: PAKET.DATA_SMART_CONTRACT,
    data,
  };
};

export const setLoadingRegister = (load) => {
  return {
    type: PAKET.LOADING_REGISTER,
    load,
  };
};
export const setLoadingSmartContract = (load) => {
  return {
    type: PAKET.LOADING_SMART_CONTRACT,
    load,
  };
};
export const setLoadingCheckout = (load) => {
  return {
    type: PAKET.LOADING_CHECKOUT,
    load,
  };
};

export const getPaket = (where = "", type = "REGISTER") => {
  return (dispatch) => {
    if (type === "SMART_CONTRACT") {
      dispatch(setLoadingSmartContract(true));
    } else {
      dispatch(setLoadingRegister(true));
    }
    let url = `paket/list/${type}`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res, status) => {
      if (type === "SMART_CONTRACT") {
        dispatch(setDataSmartContract(res));
        dispatch(setLoadingSmartContract(false));
      } else {
        dispatch(setDataRegister(res));
        dispatch(setLoadingRegister(false));
      }
    });
  };
};

export const checkout = (e) => {
  return (dispatch) => {
    dispatch(setLoadingCheckout(true));
    handlePost("penjualan/checkout", e, (res, status, msg) => {
      if (status) {
        if (e.metode_pembayara === "TRANSFER") {
          Message.success(msg).then(() =>
            Router.push(StringLink.pembelian).then(() =>
              dispatch(setLoadingCheckout(false))
            )
          );
        } else {
          Message.success(msg).then(() =>
            Router.push(StringLink.pembelian).then(() =>
              dispatch(setLoadingCheckout(false))
            )
          );
        }
      } else {
        dispatch(setLoadingCheckout(false));
      }
    });
  };
};
