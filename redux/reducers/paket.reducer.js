import { PAKET, CART } from "../type";
const initialState = {
  loadingRegister: true,
  loadingSmartContract: true,
  loadingHappyShopping: true,
  loadingCheckout: false,
  loadingDetail: true,

  dataDetail: [],
  dataRegister: [],
  paginationRegister: [],
  dataSmartContract: [],
  paginationSmartContract: [],
  dataHappyShopping: [],
  paginationHappyShopping: [],
};

export const paketReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAKET.DATA_DETAIL_PAKET:
      return {
        ...state,
        dataDetail: action.data.data,
      };
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
    case PAKET.DATA_HAPPY_SHOPPING:
      return {
        ...state,
        dataHappyShopping: action.data.data,
        paginationHappyShopping: action.data.pagination,
      };
    case PAKET.LOADING_HAPPY_SHOPPING:
      return Object.assign({}, state, {
        loadingHappyShopping: action.load,
      });
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
    case PAKET.LOADING_DETAIL_PAKET:
      return Object.assign({}, state, {
        loadingDetail: action.load,
      });
    default:
      return state;
  }
};
