import { MEMBER } from "../type";
import { handlePost, handlePut } from "../../action/baseAction";
import authAction from "../../action/auth.action";
import { Message } from "antd";
import Router from "next/router";

export const setLoading = (load) => {
  return {
    type: MEMBER.LOADING,
    load,
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
