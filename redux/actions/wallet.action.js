import { WALLET } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import { StringLink } from "../../helper/string_link_helper";
import { Message, Modal } from "antd";
import Router from "next/router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
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

export const cancelDepositAction = (kd_trx, e) => {
  // dispatch(setLoadingDeposit(true));
  return (dispatch) => {
    handlePut(
      `transaction/deposit/${btoa(kd_trx)}/approve`,
      { status: 2 },
      (res, status, msg) => {
        dispatch(depositAction(e));
      }
    );
  };
};

export const depositAction = (data) => {
  return (dispatch) => {
    dispatch(setLoadingDeposit(true));
    handlePost("transaction/deposit", data, (res, status, msg) => {
      if (status) {
        Message.success(msg).then(() => {
          if (msg === "Masih ada transaksi yang belum selesai..") {
            confirm({
              visible: true,
              title: "transaksi pending #" + res.data.kd_trx,
              icon: <ExclamationCircleOutlined />,
              okText: "Ya, batalkan",
              cancelText: "kembali",
              content:
                "Apakah anda akan melanjutkan proses ini dan membatalkan transaksi sebelumnya ?",
              onOk() {
                // Object.assign(data,{kd_trx:res.data.kd_trx})
                dispatch(cancelDepositAction(res.data.kd_trx, data));
              },

              onCancel() {
                console.log("Cancel");
              },
            });
            dispatch(setLoadingDeposit(false));
          } else {
            localStorage.setItem("typeTrx", "Deposit");
            localStorage.setItem("kdTrx", res.data.invoice_no);
            localStorage.setItem("linkBack", "/");
            Message.success("anda akan dialihkan ke halaman invoice").then(
              () => {
                Router.push(StringLink.invoiceProduct).then(() => {
                  dispatch(setLoadingDeposit(false));
                });
              }
            );
          }
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
