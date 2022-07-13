import { REPORT } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";

export const setDataTransaction = (data) => {
  return {
    type: REPORT.DATA_TRANSACTION,
    data,
  };
};

export const setLoadingTransaction = (load) => {
  return {
    type: REPORT.LOADING_TRANSACTION,
    load,
  };
};
export const setDataPurchase = (data) => {
  return {
    type: REPORT.DATA_PURCHASE,
    data,
  };
};

export const setLoadingPurchase = (load) => {
  return {
    type: REPORT.LOADING_PURCHASE,
    load,
  };
};

export const reportPurchaseAction = (id, where) => {
  return (dispatch) => {
    dispatch(setLoadingPurchase(true));
    handleGet(
      `penjualan/report?perpage=10&id_member=${id}${where}`,
      (res, status) => {
        dispatch(setDataPurchase(res));
        dispatch(setLoadingPurchase(false));
      }
    );
  };
};
