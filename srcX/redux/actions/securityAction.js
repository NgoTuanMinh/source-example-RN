import {
  VERIFY_SECURITY_SUCCESS,
  VERIFY_SECURITY_SMS_SUCCESS,
  RESET_SECURITY_REDUCER,
  VERIFY_EMAIL_SUCCESS,
  RESET_VERIFY_PASS_CODE_EMAIL
} from './actionTypes';
import { getProfileDetails } from './profile';
import {sendVerifyCode, updateAndSendVerifyCode, verifyCode} from './account';

const errorMessage = 'Network request failed'

const isVerifySecurity = payload => {
  return {
    type: VERIFY_SECURITY_SUCCESS,
    payload,
  };
};

const isVerifyEmail = payload => {
  return {
    type: VERIFY_EMAIL_SUCCESS,
    payload,
  };
};

const isVerifySecuritySMS = payload => {
  return {
    type: VERIFY_SECURITY_SMS_SUCCESS,
    payload,
  };
};

const resetVerifySecuritySMS = (data) => async dispatch => {
  dispatch(isVerifySecurity(data))
};

const resetSecurityReducer = () => {
  return {
    type: RESET_SECURITY_REDUCER,
  };
};

const onChangeSecurityInfo = (data) => async dispatch => {
  try {
    let response = await updateAndSendVerifyCode(data.to, data.via);
    if (response.success) {
      dispatch(getProfileDetails())
      dispatch(isVerifySecurity(true));
    }
    else {
      dispatch(isVerifySecurity(response));
    }
  } catch (error) {
    dispatch(isVerifyRecover({ message: errorMessage }));
  }
}

const onSendVerifyCode = (data) => async dispatch => {
  try {
    let response = await verifyCode(data.to, data.code, data.via);

    if (response.success) {
      dispatch(isVerifySecuritySMS(2))
      dispatch(isVerifyEmail(true))
    }
    else {
      dispatch(isVerifySecuritySMS(1))
    }
  } catch (error) {
    dispatch(isVerifySecuritySMS(1))
    dispatch(isVerifyRecover({ message: errorMessage }))
  }
}

const onResetSecurityReducer = () => async dispatch => {
  dispatch(resetSecurityReducer())
}

const actionResetVerifyEmail = () => {
  return {
    type: RESET_VERIFY_PASS_CODE_EMAIL,
  };
};

const resetRerifyEmailUrl = () => async dispatch => {
  dispatch(actionResetVerifyEmail());
}

export {
  onChangeSecurityInfo,
  onSendVerifyCode,
  onResetSecurityReducer,
  resetVerifySecuritySMS,
  resetRerifyEmailUrl,
}