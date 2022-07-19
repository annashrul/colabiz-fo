import { MEMBER } from "../type";
const initialState = {
  loading: false,
  data: [],
  loadingGenealogy: true,
  loadingGenealogyPraPosting: true,
  loadingGenealogyMonolegNasional: true,
  dataGenealogyPraPosting: [],
  dataGenealogyMonolegNasional: [],
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
    case MEMBER.DATA_GENEALOGY_PRA_POSTING:
      console.log("reducer", action.data);
      return {
        ...state,
        dataGenealogyPraPosting: action.data,
      };
    case MEMBER.LOADING_GENEALOGY_PRA_POSTING:
      return Object.assign({}, state, {
        loadingGenealogyPraPosting: action.load,
      });
    default:
      return state;
  }
};
