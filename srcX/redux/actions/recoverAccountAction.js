import API, { fetchApi } from './api';
import { getDataKeystore, storeKey } from './keyStore';
import {
  VERIFY_RECOVERY_SUCCESS,
  VERIFY_RECOVERY_SMS_SUCCESS,
  SET_PASSCODE_RECOVERY_SUCCESS,
  RESET_RECOVER_ACCOUNT,
  VERIFY_RECOVERY_NON_PUBLIC_KEY_SUCCESS,
  RESET_VERIFY_PASS_CODE_EMAIL,
  VERIFY_PASS_CODE_EMAIL
} from './actionTypes';
import * as Keychain from 'react-native-keychain';
import { insertCurrentDevice, fetchAccessTokens } from './authAction'
import { resetPasscode, getVaultSecretKeyFlow } from '.';
import DeviceInfo from 'react-native-device-info';
import { PhoneNumber } from 'google-libphonenumber';

const errorMessage = 'Network request failed'

const isVerifyRecover = payload => {
  return {
    type: VERIFY_RECOVERY_SUCCESS,
    payload,
  };
};

const isVerifyRecoverSMS = payload => {
  return {
    type: VERIFY_RECOVERY_SMS_SUCCESS,
    payload,
  };
};

const isSetPasscodeRecovery = payload => {
  return {
    type: SET_PASSCODE_RECOVERY_SUCCESS,
    payload,
  };
};

const resetRecoverAccount = () => {
  return {
    type: RESET_RECOVER_ACCOUNT,
  };
};

const verifyRecoverySuccessNonPublicKey = payload => {
  return {
    type: VERIFY_RECOVERY_NON_PUBLIC_KEY_SUCCESS,
    payload,
  };
}

const requestRecoveryCodeBySms = async (phoneNumber) => {
  return await fetchApi(`${API.SEND_RECOVERY_SMS}/${phoneNumber}`, 'GET');
}

const requestRecoveryCodeByEmail = async (email) => {
  return await fetchApi(`${API.SEND_RECOVERY_EMAIL}/${email}`, 'GET');
}

const requestSendRecoveryCode = (to, isViaEmail) => async dispatch => {
  const response = isViaEmail ? await requestRecoveryCodeByEmail(to) : await requestRecoveryCodeBySms(to);
    
  if (response.success) {
    dispatch(isVerifyRecover(true))
  }
  else {
    dispatch(isVerifyRecover({message : response.data.Error}))
  }
}

const verifyRecoveryCodeBySms = async (phoneNumber, code) => {
  const response = await fetchApi(`${API.VERIFY_RECOVERY_SMS}/${phoneNumber}`, 'POST', { code });
  return response;
}

const verifyRecoveryCodeByEmail = async (email, code) => {
  return await fetchApi(`${API.VERIFY_RECOVERY_EMAIL}/${email}`, 'POST', { code });
}

const verifyRecoveryCode = (to, code, isViaEmail) => async dispatch => {
  const response = isViaEmail ? await verifyRecoveryCodeByEmail(to, code) : await verifyRecoveryCodeBySms(to, code);
  if (response.success) {
    dispatch(verifyRecoverySuccessNonPublicKey(response.data));
  }
  else {
    dispatch(isVerifyRecoverSMS(1));
  }
}

const onReSetWrongPassCose = (data) => async dispatch => {
  dispatch(isVerifyRecoverSMS(0));
}

const onSetupNewPasscode = (passCode, keycloarkId, id, recoveryHashKey) => async dispatch => {
  if (!keycloarkId)
    keycloarkId = await getDataKeystore("@keycloarkId");
  if (!id)
    id = await getDataKeystore("@userId");

  const response = await resetPasscode(keycloarkId, passCode);
  if (response.success) {
    // login here
    await fetchAccessTokens(id, passCode);
    const secretResponse = await getVaultSecretKeyFlow(recoveryHashKey);
    if (secretResponse.success && secretResponse.data.data && secretResponse.data.data.data) {
      const secretKey = secretResponse.data.data.data["stellar-secret"];
      console.log("Secretkey===", secretKey);
      //await storeKey("@secretKey", secretKey);
      dispatch(isSetPasscodeRecovery({success: true, secretKey}));
    }else {
      dispatch(isSetPasscodeRecovery(secretResponse));  
    }
  }
  else {
    if (!response.data)
      response.data = { Error: "Something is wrong" };
    dispatch(isSetPasscodeRecovery(response))
  }
}

const onResetRecoverAccount = () => async dispatch => {
  dispatch(resetRecoverAccount())
}

const actionResetVerifyEmail = () => {
  return {
    type: RESET_VERIFY_PASS_CODE_EMAIL,
  };
};

const resetRerifyEmailUrl = () => async dispatch => {
  dispatch(actionResetVerifyEmail());
}

const actionVerifyEmail = payload => {
  return {
    type: VERIFY_PASS_CODE_EMAIL,
    payload,
  };
};

const verifyEmailUrl = (passcode) => async dispatch => {
  dispatch(actionVerifyEmail(passcode));
}

const insertIdDevice = async (passcode, publicKey) => {
  try {
    let token = await fetchAccessTokens(publicKey, passcode);
    if (token.access_token) {
      let uniqueDevice = await DeviceInfo.getUniqueId()
      let body = { publicKey: publicKey, idDevice: uniqueDevice };
      const response = await fetch(`${API.CREATE_ACCOUNT}/insertCurrentDevice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token.access_token}`,
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
    }
  } catch (error) {
    console.log('error insertCurrentDevice: ', error);
  }
}

export {
  requestSendRecoveryCode,
  verifyRecoveryCode,
  onSetupNewPasscode,
  onResetRecoverAccount,
  onReSetWrongPassCose,
  resetRerifyEmailUrl,
  verifyEmailUrl,
  insertIdDevice
}