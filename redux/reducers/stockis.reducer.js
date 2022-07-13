import { STOCKIS } from "../type";
const initialState = {
  loading: false,
  loadingData: true,
  data: [],
  pagination: [],

  dataOrder: [],
  paginationOrder: [],
  loadingOrder: true,
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
    default:
      return state;
  }
};
