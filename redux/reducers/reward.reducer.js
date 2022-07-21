import { REWARD } from "../type";
const initialState = {
  loadingReward: true,
  dataReward: [],
  paginationReward: [],
};

export const rewardReducer = (state = initialState, action) => {
  switch (action.type) {
    case REWARD.DATA:
      return {
        ...state,
        dataReward: action.data,
        paginationReward: action.pagination,
      };
    case REWARD.LOADING:
      return Object.assign({}, state, {
        loadingReward: action.load,
      });
    default:
      return state;
  }
};
