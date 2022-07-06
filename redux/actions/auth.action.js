import { AUTH_USER } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";
import { Message } from "antd";
import Router from "next/router";

export const setDataLogin = (data) => {
  return {
    type: AUTH_USER.DATA_USER_LOGIN,
    data,
  };
};
export const setDataUserDetail = (data) => {
  return {
    type: AUTH_USER.DATA_USER_DETAIL,
    data,
  };
};
export const setDataInfo = (data) => {
  return {
    type: AUTH_USER.DATA_INFO,
    data,
  };
};
export const setDataPin = (data) => {
  return {
    type: AUTH_USER.DATA_PIN,
    data,
  };
};
export const setDataResendEmail = (data) => {
  return {
    type: AUTH_USER.DATA_RESEND_EMAIL,
    data,
  };
};
export const setDataSignUp = (data) => {
  return {
    type: AUTH_USER.DATA_SIGNUP,
    data,
  };
};

export const setLoadingLogin = (load) => {
  return {
    type: AUTH_USER.LOADING,
    load,
  };
};
export const setLoadingPin = (load) => {
  return {
    type: AUTH_USER.LOADING_PIN,
    load,
  };
};
export const setValidateUsername = (load) => {
  return {
    type: AUTH_USER.VALIDATE_USERNAME,
    load,
  };
};
export const setLoadingValidateUsername = (load) => {
  return {
    type: AUTH_USER.LOADING_VALIDATE_USERNAME,
    load,
  };
};
export const setLoadingSignUp = (load) => {
  return {
    type: AUTH_USER.LOADING_SIGNUP,
    load,
  };
};

export const setLoadingResendEmail = (load) => {
  return {
    type: AUTH_USER.LOADING_RESEND_EMAIL,
    load,
  };
};

export const loginAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingLogin(true));
    handlePost("auth/signin", data, (res, status, msg) => {
      if (status) {
        Action.http.axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        Action.setToken(res.data.token);
        Action.setUser(res.data);
        dispatch(setDataLogin(res.data));
        dispatch(userDetailAction(res.data.id));
      } else {
        dispatch(setLoadingLogin(false));
      }
    });
  };
};
export const resendEmailAction = (data, callback) => {
  return (dispatch) => {
    dispatch(setLoadingResendEmail(true));
    handlePost("auth/resend/verifikasi", data, (res, status, msg) => {
      console.log("resed", status);
      console.log("resed", res.length);

      if (status && res.length === undefined) {
        Message.success(res.meta.message).then(() => {
          Router.push("/signin").then(() => {
            callback(false);
            dispatch(setLoadingResendEmail(false));
          });
        });
      } else {
        callback(true);
        dispatch(setLoadingResendEmail(false));
      }
    });
  };
};
export const signUpAction = (e) => {
  return (dispatch) => {
    dispatch(setLoadingSignUp(true));
    handlePost("auth/signup", e, (res, status, msg) => {
      if (status) {
        Message.success(res.meta.message).then(() =>
          Router.push("/").then(() => dispatch(setLoadingSignUp(false)))
        );
      } else {
        dispatch(setLoadingSignUp(false));
      }
    });
  };
};

export const validateUsernameAction = (username) => {
  return (dispatch) => {
    dispatch(setLoadingValidateUsername(true));
    handlePost(
      "auth/validate/username",
      { username: username },
      (res, status, msg) => {
        dispatch(setValidateUsername(status));
        dispatch(setLoadingValidateUsername(false));
      }
    );
  };
};

export const infoAction = () => {
  return (dispatch) => {
    handleGet("site/info", (res, status) => {
      dispatch(setDataInfo(res.data));
      Action.setInfo(res.data);
    });
  };
};
export const userDetailAction = (id) => {
  return (dispatch) => {
    handleGet(`member/get/${id}`, (res, status) => {
      let actUser = Action.getUser();
      Object.assign(actUser, res.data.detail);
      console.log(res.data);
      Action.setUser(actUser);
      Action.setBank(res.data.bank);
      Action.setAddress(res.data.address);
      dispatch(setDataUserDetail(res.data));
    });
  };
};
