import { SMS_SUCCESS, SMS_PENDING, SMS_FAILED, KEY_PAIR_SUCCESS } from '../../actions/actionTypes';
const SET_STEP = 'SET_REGISTRAION-STEP';
const SET_CODE = 'SET_COUNTRY_CODE';
const SET_NAME = 'SET_USER_NAME';
const SET_PHONE = 'SET_PHONE';
const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
const PIN_VERIFY_SUCCESS = "PIN_VERIFY_SUCCESS";
const PIN_VERIFY_FAILED = "PIN_VERIFY_FAILED";
const AUTH_SUCCESS = "AUTH_SUCCESS";
const AUTH_FAILED = "AUTH_FAILED"
const AUTH_PENDING = "AUTH_PENDING";
const WALLET_KEY_SUCCESS = "WALLET_KEY_SUCCESS";
const WALLET_KEY_FAILED = "WALLET_KEY_FAILED";
const SCREEN_NAME_SUCCESS = "SCREEN_NAME_SUCCESS";
const PROFILE_SUCCESS = "PROFILE_SUCCESS";
const PIN_VERIFY_RESET = "PIN_VERIFY_RESET"
const LOADING_PHONE_NUMBER_SCREEN = "LOADING_PHONE_NUMBER_SCREEN"
const VERIFY_PASS_CODE_EMAIL = 'VERIFY_PASS_CODE_EMAIL'
const RESET_VERIFY_PASS_CODE_EMAIL = 'RESET_VERIFY_PASS_CODE_EMAIL'
const VERIFY_EMAIL_SUCCESS = 'VERIFY_EMAIL_SUCCESS'

const initialState = {
  currentStep: 1,
  stepsCounter: 7,
  userInfo: {
    code: {
      code: '',
      image: 'NL'
    },
    phone: '',
    name: 'User',
    passcode: null
  },
  account: {},
  auth: {},
  smsError: {},
  profile: {},
  keypair: null,
  pinSuccess: 0,
  pinFailed: 0,
  loading: false,
  passcodeEmail: '',
};

export default function (state = initialState, action) {
  switch (action.type) {

    case KEY_PAIR_SUCCESS: {
      return {
        ...state,
        keypair: action.keypair
      };
    }

    case SET_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case SET_CODE:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          code: action.payload
        }
      };

    case SET_NAME:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          name: action.payload
        }
      };

    case SET_PHONE:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          phone: action.payload
        }
      };

    case SMS_SUCCESS: {
      return {
        ...state,
        sms: {
          ...state.sms,
          message: action.payload
        },
        smsSuccess: true,
        smsPending: false,
        smsFailed: false
      };
    }

    case SMS_PENDING: {
      return {
        ...state,
        smsSuccess: false,
        smsPending: true,
        smsFailed: false
      };
    }

    case SMS_FAILED: {
      return {
        ...state,
        smsSuccess: false,
        smsPending: false,
        smsFailed: true,
        smsError: action.payload
      };
    }

    case PIN_VERIFY_SUCCESS: {
      return {
        ...state,
        pinSuccess: true,
        pinFailed: 0
      };
    }

    case PIN_VERIFY_RESET: {
      return {
        ...state,
        pinSuccess: false,
        pinFailed: 0,
      }
    }

    case PIN_VERIFY_FAILED: {
      return {
        ...state,
        pinSuccess: false,
        pinFailed: 1
      };
    }
    case AUTH_PENDING:
      return {
        ...state,
        auth: {},
        authPending: true,
        authSuccess: false,
        authFailed: false
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        auth: action.payload,
        authPending: false,
        authSuccess: true,
        authFailed: false
      };

    case AUTH_FAILED:
      return {
        ...state,
        auth: action.payload,
        authPending: false,
        authSuccess: false,
        authFailed: true
      };
    case SCREEN_NAME_SUCCESS:
      return {
        ...state,
        screenName: action.payload
      };
    case WALLET_KEY_SUCCESS:
      return {
        ...state,
        wallet: action.payload,
        walletSuccess: true,
        walletFailed: false
      };

    case WALLET_KEY_FAILED:
      return {
        ...state,
        wallet: action.payload,
        walletSuccess: false,
        walletFailed: true
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        userInfo: {
          ...state.userInfo,
          phone: action.payload.phoneNumber ? action.payload.phoneNumber : state.userInfo.phone
        }
      }
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          emailVerified: action.payload,
        }
      }
    case LOADING_PHONE_NUMBER_SCREEN:
      return {
        ...state,
        loading: action.payload
      }
    case VERIFY_PASS_CODE_EMAIL: {
      return {
        ...state,
        passcodeEmail: action.payload
      }
    }
    case RESET_VERIFY_PASS_CODE_EMAIL: {
      return {
        ...state,
        passcodeEmail: '',
      }
    }
    default:
      return state;
  }
}

export const setRegistrationStep = payload => {
  return {
    type: SET_STEP,
    payload
  };
};

export const setCountryCode = payload => {
  return {
    type: SET_CODE,
    payload
  };
};

export const setUserPhone = payload => {
  return {
    type: SET_PHONE,
    payload
  };
};


export const createUserAccount = payload => {
  return {
    type: CREATE_ACCOUNT,
    payload
  };
};

export const getProfileSuccess = payload => {
  return {
    type: PROFILE_SUCCESS,
    payload
  };
};
