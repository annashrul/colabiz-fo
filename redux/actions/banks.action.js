import { BANKS } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import { message } from "antd";
import authAction from "../../action/auth.action";
import Router from "next/router";

export const setDataBankMember = (data) => {
  return {
    type: BANKS.DATA_BANK_MEMBER,
    data,
  };
};

export const setDataBankCompany = (data) => {
  return {
    type: BANKS.DATA_BANK_COMPANY,
    data,
  };
};
export const setDataBankGeneral = (data) => {
  return {
    type: BANKS.DATA_BANK_GENERAL,
    data,
  };
};

export const setLoadingBankMember = (load) => {
  return {
    type: BANKS.LOADING_BANK_MEMBER,
    load,
  };
};
export const setLoadingBankCompany = (load) => {
  return {
    type: BANKS.LOADING_DATA_BANK_COMPANY,
    load,
  };
};
export const setLoadingBankGeneral = (load) => {
  return {
    type: BANKS.LOADING_DATA_BANK_GENERAL,
    load,
  };
};

export const bankGeneralAction = () => {
  return (dispatch) => {
    dispatch(setLoadingBankGeneral(true));
    handleGet("transaction/data_bank", (res, status) => {
      dispatch(setDataBankGeneral(res.data));
      dispatch(setLoadingBankGeneral(false));
    });
  };
};

export const putBankMemberAction = (data, id, callback) => {
  return (dispatch) => {
    dispatch(setLoadingBankMember(true));
    handlePut(`member/update/bank/${id}`, data, (res, status, msg) => {
      if (status) {
        message.success(msg).then(() => {
          message.info("anda akan dialihkan ke halaman login").then(() => {
            Router.push("/signin").then(() =>
              dispatch(setLoadingBankMember(false))
            );
            authAction.doLogout();
          });
        });
      } else {
        dispatch(setLoadingBankMember(false));
      }
      callback(true);
    });
  };
};
