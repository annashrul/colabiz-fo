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
    setLoadingProvince(true);
    handleGet("transaction/kurir/get/provinsi", (res, status) => {
      console.log("province", res.data);
      dispatch(setDataProvince(res.data));
      setLoadingProvince(false);
    });
  };
};

export const cityAction = (idProvince) => {
  return (dispatch) => {
    handleGet(`transaction/kurir/get/kota?id=${idProvince}`, (res, status) => {
      dispatch(setDataCity(res.data));
      console.log("city", res.data);
    });
  };
};

export const districtsAction = (idCity) => {
  return (dispatch) => {
    handleGet(`transaction/kurir/get/kecamatan?id=${idCity}`, (res, status) => {
      dispatch(setDataDistricts(res.data));
      console.log("districts", res.data);
    });
  };
};
