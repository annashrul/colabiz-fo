import { MEMBER } from "../type";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import authAction, { doLogout } from "../../action/auth.action";
import { Message } from "antd";
import Router from "next/router";
import { getConfigAction } from "./info.action";

export const setLoading = (load) => {
  return {
    type: MEMBER.LOADING,
    load,
  };
};
export const setLoadingGenealogy = (load) => {
  return {
    type: MEMBER.LOADING_GENEALOGY_PRA_POSTING,
    load,
  };
};

export const setDataGenealogy = (data) => {
  return {
    type: MEMBER.DATA_GENEALOGY_PRA_POSTING,
    data,
  };
};

export const getGenealogyAction = (where = "", callback) => {
  return (dispatch) => {
    dispatch(setLoadingGenealogy(true));
    handleGet("member/genealogy/" + where, (res, status) => {
      // console.log("res.data", res.data);
      let data = res.data;
      data.map((row, index) => {
        if (row.id === where) {
          Object.assign(row, { isActive: true, no: index });
        } else {
          Object.assign(row, {
            isActive: false,
            no: index,
          });
        }
      });
      // setTimeout(() => {
      //   data.map((row, index) => {
      //     if (row.id === where) {
      //       Object.assign(row, { isActive: true, no: index });
      //     }
      //   });
      // }, 100);

      // data.length > 0 && dispatch(setDataGenealogy(data));
      dispatch(setLoadingGenealogy(false));
      console.log("response redux", data);
      // if (res.data !== undefined) {
      //   if (res.data.length > 0) {
      // res.data.map((row, index) => {
      //   Object.assign(row, {
      //     isActive: false,
      //   });
      // });

      // res.data.map((row, index) => {
      //   if (row.id === val) {
      //     Object.assign(row, { isActive: true, no: index });
      //   }
      // });
      //   }
      // }

      // callback(res.data);
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
export const createPinAction = (id, e, callback) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handlePut(`member/pin/${id}`, { pin: e }, (res, status, msg) => {
      if (status) {
        Message.success(msg);
        dispatch(getConfigAction());
        dispatch(setLoading(false));
        callback(false);
      } else {
        callback(true);
        dispatch(setLoading(false));
      }
    });
  };
};
