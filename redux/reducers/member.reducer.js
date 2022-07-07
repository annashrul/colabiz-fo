import { MEMBER } from "../type";
const initialState = {
  loading: false,
  data: [],
  loadingGenealogy: true,
  dataGenealogy: [],
};

export const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case MEMBER.LOADING:
      return Object.assign({}, state, {
        loading: action.load,
      });
    case MEMBER.DATA_GENEALOGY:
      return {
        ...state,
        dataGenealogy: action.data,
      };
    case MEMBER.LOADING_GENEALOGY:
      return Object.assign({}, state, {
        loadingGenealogy: action.load,
      });
    default:
      return state;
  }
};
