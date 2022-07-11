import { STOCKIS } from "../type";
const initialState = {
  loading: false,
  loadingData: true,
  data: [],
  pagination: [],
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
    case STOCKIS.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    default:
      return state;
  }
};
