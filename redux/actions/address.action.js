import { ADDRESS } from "../type";
import Action from "../../action/auth.action";
import { handleGet, handlePost } from "../../action/baseAction";

export const setDataProvince = (data) => {
  return {
    type: ADDRESS.DATA_PROVINCE,
    data,
  };
};

export const setDataCity = (data) => {
  return {
    type: ADDRESS.DATA_CITY,
    data,
  };
};
export const setDataDistricts = (data) => {
  return {
    type: ADDRESS.DATA_DISTRICTS,
    data,
  };
};

export const setLoadingProvince = (load) => {
  return {
    type: ADDRESS.LOADING_PROVINCE,
    load,
  };
};
export const setLoadingCity = (load) => {
  return {
    type: ADDRESS.LOADING_CITY,
    load,
  };
};
export const setLoadingDistricts = (load) => {
  return {
    type: ADDRESS.LOADING_DISTRICTS,
    load,
  };
};

export const provinceAction = () => {
  return (dispatch) => {
    dispatch(setLoadingProvince(true));
    handleGet("kurir/get/provinsi", (res, status) => {
      console.log("province", res.data);
      dispatch(setDataProvince(res.data));
      dispatch(setLoadingProvince(false));
    });
  };
};

export const cityAction = (idProvince) => {
  return (dispatch) => {
    dispatch(setLoadingCity(true));
    handleGet(`kurir/get/kota?id=${idProvince}`, (res, status) => {
      dispatch(setDataCity(res.data));
      dispatch(setLoadingCity(false));
    });
  };
};

export const districtsAction = (idCity) => {
  return (dispatch) => {
    dispatch(setLoadingDistricts(true));
    handleGet(`kurir/get/kecamatan?id=${idCity}`, (res, status) => {
      dispatch(setDataDistricts(res.data));
      dispatch(setLoadingDistricts(false));
    });
  };
};
