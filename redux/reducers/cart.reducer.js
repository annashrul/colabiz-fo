import { CART } from "../type";
const initialState = {
  data: [],
  pagination: [],
  loading: true,
  loadingAdd: false,
  loadingDelete: false,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART.DATA:
      console.log(action.data);
      return {
        ...state,
        data: action.data.data,
        pagination: action.data.pagination,
      };
    case CART.LOADING_DATA:
      return Object.assign({}, state, {
        loading: action.load,
      });
    case CART.LOADING_ADD:
      return Object.assign({}, state, {
        loadingAdd: action.load,
      });
    case CART.LOADING_DELETE:
      return Object.assign({}, state, {
        loadingDelete: action.load,
      });

    default:
      return state;
  }
};
