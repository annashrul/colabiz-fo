import { AUTH_USER } from "../type";
const initialState = {
  loadingResendEmail: false,
  dataResendEmail: [],
  loadingLogin: false,
  loadingPin: false,
  dataLogin: [],
  dataInfo: [],
  loadingUserDetail: true,
  dataUserDetail: [],
  dataPin: [],
  validateUsername: false,
  loadingValidateUsername: false,
  dataSignUp: [],
  loadingSignUp: false,
};

export const authUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER.DATA_USER_LOGIN:
      return {
        ...state,
        dataLogin: action.data,
      };
    case AUTH_USER.DATA_RESEND_EMAIL:
      return {
        ...state,
        dataResendEmail: action.data,
      };
    case AUTH_USER.DATA_USER_DETAIL:
      return {
        ...state,
        dataUserDetail: action.data,
      };
    case AUTH_USER.DATA_INFO:
      return {
        ...state,
        dataInfo: action.data,
      };
    case AUTH_USER.DATA_PIN:
      return {
        ...state,
        dataPin: action.data,
      };
    case AUTH_USER.DATA_SIGNUP:
      return {
        ...state,
        dataSignUp: action.data,
      };
    case AUTH_USER.LOADING:
      return Object.assign({}, state, {
        loadingLogin: action.load,
      });
    case AUTH_USER.LOADING_PIN:
      return Object.assign({}, state, {
        loadingPin: action.load,
      });
    case AUTH_USER.VALIDATE_USERNAME:
      return Object.assign({}, state, {
        validateUsername: action.load,
      });
    case AUTH_USER.LOADING_VALIDATE_USERNAME:
      return Object.assign({}, state, {
        loadingValidateUsername: action.load,
      });
    case AUTH_USER.LOADING_SIGNUP:
      return Object.assign({}, state, {
        loadingSignUp: action.load,
      });
    case AUTH_USER.LOADING_RESEND_EMAIL:
      return Object.assign({}, state, {
        loadingResendEmail: action.load,
      });
    case AUTH_USER.LOADING_USER_DETAIL:
      console.log("redux", action.load);
      return Object.assign({}, state, {
        loadingUserDetail: action.load,
      });

    default:
      return state;
  }
};
