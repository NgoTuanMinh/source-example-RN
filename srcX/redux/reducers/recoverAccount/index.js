import {
  VERIFY_RECOVERY_SUCCESS,
  VERIFY_RECOVERY_SMS_SUCCESS,
  SET_PASSCODE_RECOVERY_SUCCESS,
  RESET_RECOVER_ACCOUNT,
  VERIFY_RECOVERY_NON_PUBLIC_KEY_SUCCESS
} from '../../actions/actionTypes';

// isVerifyRecoverSMS == 0 null
// isVerifyRecoverSMS == 1 : wrong code
// isVerifyRecoverSMS == 2 : success code
const initialState = {
  isVerifyRecover: false,
  isVerifyRecoverSMS: 0,
  isSetPasscodeRecovery: false,
  accountRecoveryNonPublicKey: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VERIFY_RECOVERY_SUCCESS:
      return {
        ...state,
        isVerifyRecover: action.payload
      }
    case VERIFY_RECOVERY_SMS_SUCCESS:
      return {
        ...state,
        isVerifyRecoverSMS: action.payload
      }
    case SET_PASSCODE_RECOVERY_SUCCESS:
      return {
        ...state,
        isSetPasscodeRecovery: action.payload
      }
    case RESET_RECOVER_ACCOUNT:
      return {
        ...initialState,
        accountRecoveryNonPublicKey: state.accountRecoveryNonPublicKey
      }
    case VERIFY_RECOVERY_NON_PUBLIC_KEY_SUCCESS:
      return {
        ...state,
        accountRecoveryNonPublicKey: action.payload,
        isVerifyRecoverSMS: 2
      }
    default:
      return state
  }
}