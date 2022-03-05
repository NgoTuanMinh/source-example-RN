import { 
  VERIFY_SECURITY_SUCCESS,
  VERIFY_SECURITY_SMS_SUCCESS,
  RESET_SECURITY_REDUCER
} from '../../actions/actionTypes';

// isVerifySecuritySMS == 0 null
// isVerifySecuritySMS == 1 : wrong code
// isVerifySecuritySMS == 2 : success code

const initialState = {
  isVerifySecurity: false,
  isVerifySecuritySMS: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VERIFY_SECURITY_SUCCESS:
      return {
        ...state,
        isVerifySecurity: action.payload
      }
    case VERIFY_SECURITY_SMS_SUCCESS:
      return {
        ...state,
        isVerifySecuritySMS: action.payload
      }
    case RESET_SECURITY_REDUCER: 
      return initialState
    default:
      return state
  }
}