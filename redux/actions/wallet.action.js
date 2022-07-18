import { WALLET } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost, handlePut } from "../../action/baseAction";
import { StringLink } from "../../helper/string_link_helper";
import { Message, Modal } from "antd";
import Router from "next/router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import general_helper from "../../helper/general_helper";
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
      console.log(res);
      if (status) {
        Message.success(msg).then(() => {
          if (msg === "Masih ada transaksi yang belum selesai..") {
            confirm({
              visible: true,
              title: "Masih ada transaksi aktif!",
              icon: <ExclamationCircleOutlined />,
              okText: "Batalkan Transaksi.",
              okType: "danger",
              cancelText: "Lihat Invoice",
              content:(
                <>
                  #{res.data.kd_trx}
                  <br/>
                  Jumlah: {general_helper.toRp(res.data.amount)}
                </>
              ),
              onOk() {
                // Object.assign(data,{kd_trx:res.data.kd_trx})
                dispatch(cancelDepositAction(res.data.kd_trx, data));
              },
              onCancel() {
                localStorage.setItem("typeTrx", "Deposit");
                localStorage.setItem("kdTrx", res.data.kd_trx);
                localStorage.setItem("linkBack", "/");
                Router.push(StringLink.invoiceProduct).then(() => {
                  dispatch(setLoadingDeposit(false));
                });
              }
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
