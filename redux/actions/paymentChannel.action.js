import { PAYMENT_CHANNEL } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";

export const setData = (data) => {
  return {
    type: PAYMENT_CHANNEL.DATA,
    data,
  };
};

export const setLoading = (load) => {
  return {
    type: PAYMENT_CHANNEL.LOADING,
    load,
  };
};

export const paymentChannelAction = () => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet("transaction/channel", (res, status) => {
      //   console.log("action", res.data);
      dispatch(setData(res.data));
      dispatch(setLoading(false));
    });
  };
};
