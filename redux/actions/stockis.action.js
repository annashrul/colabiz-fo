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

export const getStockisAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoadingData(true));

    handleGet(`stockis?status=1&perpage=12&${where}`, (res, status) => {
      dispatch(setData(res));
      dispatch(setLoadingData(false));
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
