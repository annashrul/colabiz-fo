import { INVOICE } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";

export const setData = (data) => {
  return {
    type: INVOICE.DATA,
    data,
  };
};

export const setLoading = (load) => {
  return {
    type: INVOICE.LOADING,
    load,
  };
};

export const invoiceAction = (kdTrx, type = "produk") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `penjualan/invoice/${btoa(kdTrx)}`;
    if (type.toLowerCase() === "deposit") {
      url = `transaction/deposit/${btoa(kdTrx)}/invoice`;
    }
    handleGet(url, (res, status) => {
      dispatch(setData(res.data));
      dispatch(setLoading(false));
    });
  };
};
