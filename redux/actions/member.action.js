import { MEMBER } from "../type";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import authAction, { doLogout } from "../../action/auth.action";
import { Message } from "antd";
import Router from "next/router";

export const setLoading = (load) => {
  return {
    type: MEMBER.LOADING,
    load,
  };
};
export const setLoadingGenealogy = (load) => {
  return {
    type: MEMBER.LOADING_GENEALOGY,
    load,
  };
};

export const setDataGenealogy = (data) => {
  return {
    type: MEMBER.DATA_GENEALOGY,
    data,
  };
};

export const getGenealogyAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoadingGenealogy(true));
    handleGet("member/genealogy/" + where, (res, status) => {
      dispatch(setDataGenealogy(res.data));
      dispatch(setLoadingGenealogy(false));
    });
  };
};
export const putMemberAction = (id, e) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handlePut(`member/update/data/${id}`, e, (res, status, msg) => {
      if (status) {
        Message.success(msg)
          .then(() => Message.info("Anda akan dialikan ke halaman login"))
          .then(() => {
            Router.push("/signin").then(() => {
              dispatch(setLoading(false));
              authAction.doLogout();
            });
          });
      } else {
        dispatch(setLoading(false));
      }
    });
  };
};
export const createPinAction = (id, e) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handlePut(`member/pin/${id}`, { pin: e }, (res, status, msg) => {
      if (status) {
        Message.success(msg).then(() => {
          Message.info(
            "Demi keamanan, Anda akan dialihkan ke halaman login terlebih dahulu"
          ).then(() => {
            Router.push("/signin").then(() => {
              dispatch(setLoading(false));
              doLogout();
            });
          });
        });
      } else {
        dispatch(setLoading(false));
      }
    });
  };
};
