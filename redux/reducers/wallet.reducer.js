import { WALLET } from "../type";
const initialState = {
  loadingWithdraw: false,
  loadingDeposit: false,
};

export const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case WALLET.LOADING_DEPOSIT:
      return Object.assign({}, state, {
        loadingDeposit: action.load,
      });
    case WALLET.LOADING_WITHDRAW:
      return Object.assign({}, state, {
        loadingWithdraw: action.load,
      });

    default:
      return state;
  }
};
