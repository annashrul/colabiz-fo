import { STOCKIS } from "../type";
const initialState = {
  loading: false,
  data: [],
};

export const stockisReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCKIS.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    default:
      return state;
  }
};
