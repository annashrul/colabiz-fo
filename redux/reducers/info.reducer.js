import { INFO, PIN } from "../type";
const initialState = {
  data: [],
  loading: true,
  loadingPinAktivasi: false,
  loadingPinHappyShopping: false,
  loadingPinSmartContract: false,
};

export const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case INFO.DATA:
      return {
        ...state,
        data: action.data,
      };
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
