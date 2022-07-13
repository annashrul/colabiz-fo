import { REPORT } from "../type";
const initialState = {
  dataTransaction: [],
  dataPurchase: [],

  paginationTransaction: [],
  paginationPurchase: [],
  loadingTransaction: true,
  loadingPurchase: true,
};

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORT.DATA_TRANSACTION:
      return {
        ...state,
        dataTransaction: action.data.data,
        paginationTransaction: action.data.pagination,
      };

    case REPORT.DATA_PURCHASE:
      return {
        ...state,
        dataPurchase: action.data.data,
        paginationPurchase: action.data.pagination,
      };

    case REPORT.LOADING_TRANSACTION:
      return Object.assign({}, state, {
        loadingTransaction: action.load,
      });
    case REPORT.LOADING_PURCHASE:
      return Object.assign({}, state, {
        loadingPurchase: action.load,
      });

    default:
      return state;
  }
};
