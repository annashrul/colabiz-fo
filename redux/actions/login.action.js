import { LOGIN } from "../type";
import Action from "../../action/auth.action";
import { handlePost } from "../../action/baseAction";

export const setSuccess = (data) => {
  return {
    type: LOGIN.SUCCESS,
    data,
  };
};

export const setLoading = (load) => {
  return {
    type: LOGIN.LOADING,
    load,
  };
};

export const loginAction = (data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handlePost("auth/signin", data, (res, status, msg) => {
      dispatch(setSuccess(res.data));
      Action.http.axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      dispatch(setLoading(false));
      //   setTimeout(() => dispatch(setLoading(false)), 300);
    });
  };
};
