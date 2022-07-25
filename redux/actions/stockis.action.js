import { STOCKIS } from "../type";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import { Message } from "antd";
import Router from "next/router";

export const setLoadingDetail = (load) => {
  return {
    type: STOCKIS.LOADING_DETAIL,
    load,
  };
};

export const setDataDetail = (data) => {
  return {
    type: STOCKIS.DETAIL,
    data,
  };
};

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
export const setLoadingApprove = (load) => {
  return {
    type: STOCKIS.LOADING_APPROVE_ORDER,
    load,
  };
};
export const setLoadingCancel = (load) => {
  return {
    type: STOCKIS.LOADING_CANCEL_ORDER,
    load,
  };
};
export const setLoadingTake = (load) => {
  return {
    type: STOCKIS.LOADING_TAKE_ORDER,
    load,
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

export const getStockisDetailAction = (id) => {
  return (dispatch) => {
    dispatch(setLoadingDetail(true));
    handleGet(`stockis/get/${id}`, (res, status) => {
      dispatch(setDataDetail(res));
      dispatch(setLoadingDetail(false));
    });
  };
};

export const orderStockisAction = (id, where = "") => {
  return (dispatch) => {
    dispatch(setLoadingOder(true));
    handleGet(`penjualan/report?id_stockis=${id}&${where}`, (res, status) => {
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

export const approveStockisAction = (kdTrx, stat, detail) => {
  return (dispatch) => {
    handlePut(
      `penjualan/approve/${btoa(kdTrx)}`,
      { status: stat },
      (res, status, msg) => {
        dispatch(orderStockisAction(detail.id, detail.where));
        Message.success(msg);
      }
    );
  };
};

export const approveCodeAction = (kdTrx, data, detail, callback) => {
  return (dispatch) => {
    dispatch(setLoadingApprove(true));
    handlePut(
      `penjualan/ambil/confirm/${btoa(kdTrx)}`,
      data,
      (res, status, msg) => {
        callback(status);
        if (status) {
          Message.success(msg);
          dispatch(orderStockisAction(detail.id, detail.where));
        } else {
          Message.info(msg);
        }

        dispatch(setLoadingApprove(false));
      }
    );
  };
};

export const sendCodeAction = (kdTrx, detail, callback) => {
  return (dispatch) => {
    dispatch(setLoadingApprove(true));
    handlePost(
      `penjualan/ambil/send/${btoa(kdTrx)}`,
      {},
      (res, status, msg) => {
        callback(status);
        if (status) {
          Message.success(msg);
          dispatch(orderStockisAction(detail.id, detail.where));
        } else {
          Message.info(msg);
        }

        dispatch(setLoadingApprove(false));
      }
    );
  };
};
