import { combineReducers } from "redux";
import { loginReducer } from "./reducers/login.reducer";
import { authUserReducer } from "./reducers/authUser.reducer";
import { addressReducer } from "./reducers/address.reducer";
import { banksReducer } from "./reducers/banks.reducer";
import { stockisReducer } from "./reducers/stockis.reducer";
import { memberReducer } from "./reducers/member.reducer";
export default combineReducers({
  loginReducer,
  authUserReducer,
  addressReducer,
  banksReducer,
  stockisReducer,
  memberReducer,
});
