import { MEMBER } from "../type";
const initialState = {
  loading: false,
  data: [],
};

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case MEMBER.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    default:
      return state;
  }
};
