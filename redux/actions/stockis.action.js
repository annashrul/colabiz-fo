import { STOCKIS } from "../type";
import { handleGet, handlePost } from "../../action/baseAction";
import { Message } from "antd";
import Router from "next/router";

export const setLoading = (load) => {
  return {
    type: STOCKIS.LOADING,
    load,
  };
};
export const setLoadingData = (load) => {
  return {
    type: STOCKIS.LOADING_DATA,
    load,
  };
};
export const setData = (data) => {
  return {
    type: STOCKIS.DATA,
    data,
  };
};
export const setLoadingOder = (load) => {
  return {
    type: STOCKIS.LOADING_ORDER,
    load,
  };
};
export const setDataOrder = (data) => {
  return {
    type: STOCKIS.ORDER,
    data,
  };
};

export const getStockisAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoadingData(true));
    handleGet(`stockis?status=1&perpage=6&${where}`, (res, status) => {
      dispatch(setData(res));
      dispatch(setLoadingData(false));
    });
  };
};

export const orderStockisAction = (id, where = "") => {
  return (dispatch) => {
    dispatch(setLoadingOder(true));
    handleGet(`penjualan/report?id_stockis=${id}&${where}`, (res, status) => {
      console.log("action", res);
      dispatch(setDataOrder(res));
      dispatch(setLoadingOder(false));
    });
  };
};

export const createStockisAction = (e) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handlePost("stockis", e, (res, status, msg) => {
      dispatch(setLoading(false));
      if (status) {
        Message.success(res.meta.message).then(() =>
          Router.push("/").then(() => dispatch(setLoading(false)))
        );
      } else {
        dispatch(setLoading(false));
      }
    });
  };
};
