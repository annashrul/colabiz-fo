import { combineReducers } from "redux";
import { loginReducer } from "./reducers/login.reducer";
import { authUserReducer } from "./reducers/authUser.reducer";
import { addressReducer } from "./reducers/address.reducer";
import { banksReducer } from "./reducers/banks.reducer";
import { stockisReducer } from "./reducers/stockis.reducer";
import { memberReducer } from "./reducers/member.reducer";
import { infoReducer } from "./reducers/info.reducer";
import { paketReducer } from "./reducers/paket.reducer";
import { walletReducer } from "./reducers/wallet.reducer";
import { paymentChannelReducer } from "./reducers/paymentChannel.reducer";
import { invoiceReducer } from "./reducers/invoice.reducer";
import { reportReducer } from "./reducers/report.reducer";
import { cartReducer } from "./reducers/cart.reducer";
import { rewardReducer } from "./reducers/reward.reducer";
export default combineReducers({
  loginReducer,
  authUserReducer,
  rewardReducer,
  addressReducer,
  banksReducer,
  stockisReducer,
  memberReducer,
  infoReducer,
  paketReducer,
  walletReducer,
  paymentChannelReducer,
  invoiceReducer,
  reportReducer,
  cartReducer,
});
