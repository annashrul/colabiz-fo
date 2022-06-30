import { combineReducers } from "redux";
import { loginReducer } from "./reducers/login.reducer";
import { authUserReducer } from "./reducers/authUser.reducer";
export default combineReducers({
  loginReducer,
  authUserReducer,
});
