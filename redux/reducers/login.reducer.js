import { LOGIN } from "../type";
const initialState = {
  isLoading: false,
  datum: [],
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN.SUCCESS:
      return {
        ...state,
        datum: action.data,
      };
    case LOGIN.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });

    default:
      return state;
  }
};
