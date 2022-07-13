import { STOCKIS } from "../type";
const initialState = {
  loading: false,
  loadingData: true,
  data: [],
  pagination: [],

  dataOrder: [],
  paginationOrder: [],
  loadingOrder: true,
  loadingApprove: false,
  loadingCancel: false,
  loadingTake: false,
};

export const stockisReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCKIS.DATA:
      return {
        ...state,
        data: action.data.data,
        pagination: action.data.pagination,
      };
    case STOCKIS.LOADING_DATA:
      return Object.assign({}, state, {
        loadingData: action.load,
      });
    case STOCKIS.ORDER:
      return {
        ...state,
        dataOrder: action.data.data,
        paginationOrder: action.data.pagination,
      };
    case STOCKIS.LOADING_ORDER:
      return Object.assign({}, state, {
        loadingOrder: action.load,
      });
    case STOCKIS.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    case STOCKIS.LOADING_APPROVE_ORDER:
      return Object.assign({}, state, {
        loadingApprove: action.load,
      });
    case STOCKIS.LOADING_CANCEL_ORDER:
      return Object.assign({}, state, {
        loadingCancel: action.load,
      });
    case STOCKIS.LOADING_TAKE_ORDER:
      return Object.assign({}, state, {
        loadingTake: action.load,
      });
    default:
      return state;
  }
};
