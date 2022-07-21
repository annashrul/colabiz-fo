import { REWARD } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";

export const setData = (data) => {
  return {
    type: REWARD.DATA,
    data,
  };
};

export const setLoading = (load) => {
  return {
    type: REWARD.LOADING,
    load,
  };
};

export const getRewardAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet(`reward${where}`, (res, status) => {
      dispatch(setData(res.data));
      dispatch(setLoading(false));
    });
  };
};
