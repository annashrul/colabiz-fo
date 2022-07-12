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

export const invoiceAction = (kdTrx) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet(`transaction/deposit/${btoa(kdTrx)}/invoice`, (res, status) => {
      dispatch(setData(res.data));
      dispatch(setLoading(false));
    });
  };
};
