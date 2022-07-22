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
export const setLoadingUserDetail = (load) => {
  return {
    type: AUTH_USER.LOADING_USER_DETAIL,
    load,
  };
};
export const setLoadingSendForgotPassword = (load) => {
  return {
    type: AUTH_USER.LOADING_SEND_FORGOT_PASSWORD,
    load,
  };
};
export const setLoadingVerifyForgotPassword = (load) => {
  return {
    type: AUTH_USER.LOADING_VERIFY_FORGOT_PASSWORD,
    load,
  };
};

export const loginAction = (data, callback) => {
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
        if (res.data.pin === "-") {
          callback(undefined);
        } else {
          callback(true);
        }
        dispatch(setLoadingLogin(false));
      } else {
        callback(false);
        dispatch(setLoadingLogin(false));
      }
    });
  };
};
export const resendEmailAction = (data, callback) => {
  return (dispatch) => {
    dispatch(setLoadingResendEmail(true));
    handlePost("auth/resend/verifikasi", data, (res, status, msg) => {
      // console.log("resed", status);
      // console.log("resed", res.length);

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

export const validateUsernameAction = (username, callback = undefined) => {
  return (dispatch) => {
    dispatch(setLoadingValidateUsername(true));
    handlePost(
      "auth/validate/username",
      { username: username },
      (res, status, msg) => {
        if (!status) {
          callback(msg);
        } else {
          callback("");
        }
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
    dispatch(setLoadingUserDetail(true));
    handleGet(`member/get/${id}`, (res, status) => {
      let actUser = Action.getUser();
      Object.assign(actUser, res.data.detail);
      Action.setUser(actUser);
      Action.setBank(res.data.bank);
      Action.setAddress(
        res.data.address !== undefined
          ? res.data.address
          : {
              created_at: "2022-07-06T01:26:44.989Z",
              id: "51885392-d897-4c3c-b867-ff2ec30e3bcf",
              id_member: "92bee49a-20a2-4137-a005-bbec32f81816",
              ismain: 1,
              kd_kec: "6984",
              kd_kota: "501",
              kd_prov: "5",
              kecamatan: "-",
              kota: "-",
              main_address: "Alamat Utama",
              no_hp: "-",
              penerima: "-",
              provinsi: "-",
              title: "-",
              updated_at: "2022-07-06T01:26:44.989Z",
            }
      );
      dispatch(setDataUserDetail(res.data));
      dispatch(setLoadingUserDetail(false));
      console.log("action detail", res);
    });
  };
};

export const sendForgotPasswordAction = (data, callback) => {
  return (dispatch) => {
    dispatch(setLoadingSendForgotPassword(true));
    handlePost("auth/forgot/send", data, (res, status, msg) => {
      if (status) {
        Message.success(msg).then(() => {
          Message.info(
            "hubungi segera admin apabila anda tidak menerima email dari kami"
          ).then(() => {
            Message.info(
              "anda akan dialihkan ke halaman login terlebih dahulul"
            ).then(() => {
              dispatch(setLoadingSendForgotPassword(false));
            });
          });
        });
      } else {
        Message.info(msg).then(() => {
          dispatch(setLoadingSendForgotPassword(false));
        });
      }
    });
  };
};

export const verifyForgotPasswordAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingVerifyForgotPassword(true));

    handlePost("auth/forgot/verify", data, (res, status, msg) => {
      if (status) {
        Message.success(msg).then(() => {
          Router.push("/signin").then(() => {
            dispatch(setLoadingVerifyForgotPassword(false));
          });
        });
      } else {
        Message.info(msg).then(() => {
          dispatch(setLoadingVerifyForgotPassword(false));
        });
      }
    });
  };
};
