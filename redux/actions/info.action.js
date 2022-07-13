import { INFO } from "../type";
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
