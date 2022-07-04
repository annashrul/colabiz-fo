import { ADDRESS } from "../type";
const initialState = {
  dataProvince: [],
  dataCity: [],
  dataDistricts: [],
  loadingProvince: false,
  loadingCity: false,
  loadingDistricts: false,
};

export const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADDRESS.DATA_PROVINCE:
      return {
        ...state,
        dataProvince: action.data,
      };
    case ADDRESS.DATA_CITY:
      return {
        ...state,
        dataCity: action.data,
      };
    case ADDRESS.DATA_DISTRICTS:
      return {
        ...state,
        dataDistricts: action.data,
      };
    case ADDRESS.LOADING_PROVINCE:
      return Object.assign({}, state, {
        loadingProvince: action.load,
      });
    case ADDRESS.LOADING_CITY:
      return Object.assign({}, state, {
        loadingCity: action.load,
      });
    case ADDRESS.LOADING_DISTRICTS:
      return Object.assign({}, state, {
        loadingDistricts: action.load,
      });

    default:
      return state;
  }
};
