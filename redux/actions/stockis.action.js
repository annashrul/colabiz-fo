import { STOCKIS } from "../type";
import { handlePost } from "../../action/baseAction";

export const setLoading = (load) => {
  return {
    type: STOCKIS.LOADING,
    load,
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
