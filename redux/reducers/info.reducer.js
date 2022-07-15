import { INFO, PIN, CONFIG } from "../type";
const initialState = {
  data: [],
  dataConfig: [],
  loadingConfig: true,
  loading: true,
  loadingPinAktivasi: false,
  loadingPinHappyShopping: false,
  loadingPinSmartContract: false,
};

export const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFIG.DATA_CONFIG:
      return {
        ...state,
        dataConfig: action.data,
      };
    case INFO.DATA:
      return {
        ...state,
        data: action.data,
      };
    case CONFIG.LOADING_CONFIG:
      return Object.assign({}, state, {
        loadingConfig: action.load,
      });
    case INFO.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    case PIN.LOADING_AKTIVASI:
      return Object.assign({}, state, {
        loadingPinAktivasi: action.load,
      });
    case PIN.LOADING_AKTIVASI_HAPPY_SHOPPING:
      return Object.assign({}, state, {
        loadingPinHappyShopping: action.load,
      });
    case PIN.LOADING_AKTIVASI_SMART_CONTRACT:
      return Object.assign({}, state, {
        loadingPinSmartContract: action.load,
      });

    default:
      return state;
  }
};
