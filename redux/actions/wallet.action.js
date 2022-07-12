import { WALLET } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";
import { StringLink } from "../../helper/string_link_helper";
import { Message } from "antd";
import Router from "next/router";

export const setLoadingDeposit = (load) => {
  return {
    type: WALLET.LOADING_DEPOSIT,
    load,
  };
};
export const setLoadingWithdraw = (load) => {
  return {
    type: WALLET.LOADING_WITHDRAW,
    load,
  };
};

export const depositAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingDeposit(true));
    handlePost("transaction/deposit", data, (res, status, msg) => {
      console.log("deposit", res);
      if (status) {
        Message.success(msg).then(() => {
          localStorage.setItem("typeTrx", "Deposit");
          localStorage.setItem("kdTrx", res.data.kd_trx);
          localStorage.setItem("linkBack", "/");
          Router.push(StringLink.invoiceProduct).then(() => {
            dispatch(setLoadingDeposit(false));
          });
        });
      } else {
        dispatch(setLoadingDeposit(false));
      }
    });
  };
};

export const withdrawAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingWithdraw(true));
    handlePost("transaction/withdrawal", data, (res, status, msg) => {
      if (status) {
        Message.success(msg).then(() => {
          Message.info("Anda akan diarahkan ke halaman utama").then(() => {
            Router.push("/").then(() => {
              dispatch(setLoadingWithdraw(false));
            });
          });
        });
      } else {
        dispatch(setLoadingWithdraw(false));
      }
    });
  };
};
