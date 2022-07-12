import { INVOICE } from "../type";
const initialState = {
  data: [],
  loading: true,
};

export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVOICE.DATA:
      return {
        ...state,
        data: action.data,
      };
    case INVOICE.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });

    default:
      return state;
  }
};
