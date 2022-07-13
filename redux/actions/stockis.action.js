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

export const approveStockisAction = (kdTrx, status) => {
  return (dispatch) => {
    if (status === 1) {
      dispatch(setLoadingApprove(true));
    } else if (status === 2) {
      dispatch(setLoadingCancel(true));
    } else {
      dispatch(setLoadingTake(true));
    }
    handlePut(
      `penjualan/approve/${btoa(kdTrx)}`,
      { status: status },
      (res, status, msg) => {
        if (status === 1) {
          dispatch(setLoadingApprove(false));
        } else if (status === 2) {
          dispatch(setLoadingCancel(false));
        } else {
          dispatch(setLoadingTake(false));
        }
        Message.success(msg);
        // if(status){
        // Message.success(msg);
        // }
        // if (status) {
        //   Message.success(res.meta.message).then(() =>
        //     Router.push("/").then(() => dispatch(setLoading(false)))
        //   );
        // } else {
        //   dispatch(setLoading(false));
        // }
      }
    );
  };
};
