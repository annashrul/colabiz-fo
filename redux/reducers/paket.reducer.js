import { PAKET, CART } from "../type";
const initialState = {
  loadingRegister: true,
  loadingSmartContract: true,
  loadingCheckout: false,
  dataRegister: [],
  paginationRegister: [],
  dataSmartContract: [],
  paginationSmartContract: [],
};

export const paketReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAKET.DATA_REGISTER:
      return {
        ...state,
        dataRegister: action.data.data,
        paginationRegister: action.data.pagination,
      };
    case PAKET.DATA_SMART_CONTRACT:
      return {
        ...state,
        dataSmartContract: action.data.data,
        paginationSmartContract: action.data.pagination,
      };
    case PAKET.LOADING_REGISTER:
      return Object.assign({}, state, {
        loadingRegister: action.load,
      });
    case PAKET.LOADING_SMART_CONTRACT:
      return Object.assign({}, state, {
        loadingSmartContract: action.load,
      });
    case PAKET.LOADING_CHECKOUT:
      return Object.assign({}, state, {
        loadingCheckout: action.load,
      });
    default:
      return state;
  }
};
