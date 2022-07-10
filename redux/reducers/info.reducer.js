import { INFO } from "../type";
const initialState = {
  data: [],
  loading: true,
};

export const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case INFO.DATA:
      return {
        ...state,
        data: action.data,
      };
    case INFO.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });

    default:
      return state;
  }
};
