import { PAYMENT_CHANNEL } from "../type";
const initialState = {
  data: [],
  loading: true,
};

export const paymentChannelReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_CHANNEL.DATA:
      return {
        ...state,
        data: action.data,
      };
    case PAYMENT_CHANNEL.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });

    default:
      return state;
  }
};
