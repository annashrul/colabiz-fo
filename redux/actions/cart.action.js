import { CART } from "../type";
import Action from "../../action/auth.action";
import { handleDelete, handleGet, handlePost } from "../../action/baseAction";

export const setData = (data) => {
  return {
    type: CART.DATA,
    data,
  };
};

export const setLoading = (load) => {
  return {
    type: CART.LOADING_DATA,
    load,
  };
};
export const setLoadingAdd = (load) => {
  return {
    type: CART.LOADING_ADD,
    load,
  };
};
export const setLoadingDelete = (load) => {
  return {
    type: CART.LOADING_DELETE,
    load,
  };
};

export const getCartAction = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    handleGet(`cart?page=1&perpage=10${where}`, (res, status) => {
      dispatch(setData(res));
      dispatch(setLoading(false));
    });
  };
};
export const postCart = (idPaket, type = "tambah") => {
  return (dispatch) => {
    if (type !== "tambah") {
      dispatch(setLoadingDelete(true));
    } else {
      dispatch(setLoadingAdd(true));
    }
    handlePost(
      "cart",
      {
        type: type,
        id_paket: idPaket,
        qty: 1,
      },
      (res, status, msg) => {
        if (type !== "tambah") {
          dispatch(setLoadingDelete(false));
        } else {
          dispatch(setLoadingAdd(false));
        }
        dispatch(getCartAction());
      }
    );
  };
};

export const deleteCartAction = (idPaket) => {
  return (dispatch) => {
    // setLoadingDelete(true);
    handleDelete(`cart/${idPaket}`, (res, status, msg) => {
      dispatch(getCartAction());
      // setLoadingDelete(false);
    });
  };
};
