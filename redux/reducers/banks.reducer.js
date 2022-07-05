import { BANKS } from "../type";
const initialState = {
  dataBankMember: [],
  dataBankCompany: [],
  dataBankGeneral: [],
  loadingBankMember: false,
  loadingBankCompany: false,
  loadingBankGeneral: false,
};

export const banksReducer = (state = initialState, action) => {
  switch (action.type) {
    case BANKS.DATA_BANK_MEMBER:
      return {
        ...state,
        dataBankMember: action.data,
      };
    case BANKS.DATA_BANK_COMPANY:
      return {
        ...state,
        dataBankCompany: action.data,
      };
    case BANKS.DATA_BANK_GENERAL:
      return {
        ...state,
        dataBankGeneral: action.data,
      };
    case BANKS.LOADING_BANK_MEMBER:
      return Object.assign({}, state, {
        loadingBankMember: action.load,
      });
    case BANKS.LOADING_DATA_BANK_COMPANY:
      return Object.assign({}, state, {
        loadingBankCompany: action.load,
      });
    case BANKS.LOADING_DATA_BANK_GENERAL:
      return Object.assign({}, state, {
        loadingBankGeneral: action.load,
      });

    default:
      return state;
  }
};
