import Bugfender from "@bugfender/rn-bugfender";
import API, { fetchApi, fetchWithFormData } from "./api";
import NavigationService from "../../NavigationService";
import { getDataKeystore, storeKey, resetKeyStore } from "./keyStore";
import {
  AUTH_PENDING,
  AUTH_SUCCESS,
  AUTH_FAILED,
  TOKEN_CONVERSION_SUCCESS,
  VERIFY_PASS_CODE_EMAIL,
  RESET_VERIFY_PASS_CODE_EMAIL,
} from "./actionTypes";
import * as NewRelicRN from "../../../NewRelicRN";
import { fetchTokenPrice } from "./index";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "./account";
// import * as Keychain from 'react-native-keychain';
import FingerprintScanner from "react-native-fingerprint-scanner";
import DeviceInfo from "react-native-device-info";

import { updateRecoveryInfo, setupVaultEncryptForSecretKey } from './account';

function authPending(payload) {
  return {
    type: AUTH_PENDING,
    payload,
  };
}

const authSuccess = (payload) => {
  return {
    type: AUTH_SUCCESS,
    payload,
  };
};

function authFailed(payload) {
  return {
    type: AUTH_FAILED,
    payload,
  };
}

const tokenConversionSuccess = (payload) => {
  return {
    type: TOKEN_CONVERSION_SUCCESS,
    payload,
  };
};

const actionVerifyEmail = (payload) => {
  return {
    type: VERIFY_PASS_CODE_EMAIL,
    payload,
  };
};

const actionResetVerifyEmail = () => {
  return {
    type: RESET_VERIFY_PASS_CODE_EMAIL,
  };
};

const fetchCurrentDevice = async (publicKey) => {
  let body = { publicKey: publicKey };
  const response = await fetch(`${API.CREATE_ACCOUNT}/checkCurrentDevice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

const checkCurrentDevice = () => async (dispatch) => {
  // TODO we don't check current device anything
  /*try {
        let publicKey = await getDataKeystore("@userId");
        publicKey = JSON.parse(publicKey);
        if (!publicKey || publicKey.length == 0) return false;

        let responseCurrentDevice = await fetchCurrentDevice(publicKey);
        if (responseCurrentDevice && responseCurrentDevice.success && responseCurrentDevice.currentDevice) {
            let currentDevice = responseCurrentDevice.currentDevice;
            let uniqueDeviceID = await DeviceInfo.getUniqueId();
            if (currentDevice && currentDevice != uniqueDeviceID) {
                NavigationService.navigate("Auth");
                dispatch(userLoggedOut());
                await resetKeyStore();

                return true;
            }
        }
    } catch (error) {
        console.log('error checkCurrentDevice', error);
        return false;
    }*/
  return true;
};

const insertCurrentDevice = async (publicKey) => {
  try {
    let uniqueDevice = await DeviceInfo.getUniqueId();
    let body = { publicKey: publicKey, idDevice: uniqueDevice };
    const response = await fetchApi(
      `${API.CREATE_ACCOUNT}/insertCurrentDevice`,
      "POST",
      body
    );
  } catch (error) {
    console.log("error insertCurrentDevice: ", error);
  }
};

let token = "";

const getAccessToken = () => {
  return token;
}

const fetchAccessTokens = async (username, password) => {
  const tokens = await fetchWithFormData(
    API.GET_ACCESS_TOKEN,
    "POST",
    {
      grant_type: "password",
      client_id: API.CLIENT_ID,
      client_secret: API.CLIENT_SECRET,
      username: username,
      password: password,
    },
    true
  );

  if (tokens.success) {
    token = tokens.data.access_token;
    await storeKey("@accesstoken", tokens.data.access_token);
    await storeKey("@refreshtoken", tokens.data.refresh_token);
  }

  return tokens.data;
};

const refreshToken = async () => {
  const refreshToken = await getDataKeystore("@refreshtoken");
  const tokens = await fetchWithFormData(API.GET_ACCESS_TOKEN, "POST", {
    grant_type: "refresh_token",
    client_id: API.CLIENT_ID,
    client_secret: API.CLIENT_SECRET,
    refresh_token: refreshToken,
  });
  // console.log("Refresh Token Reponse=====", tokens);
  if (tokens.success) {
    token = tokens.data.access_token;
    await storeKey("@accesstoken", tokens.data.access_token);
    await storeKey("@refreshtoken", tokens.data.refresh_token);
  }

  return tokens;
};

// const storeToKeychain =  (username, password) => {
//     Keychain.setGenericPassword(username, password);
// }

const fetchMainWalletKey = async (publicKey) => {
  const response = await fetchApi(
    `${API.WALLETS}/bysigner/${publicKey}`,
    "GET"
  );
  if (response.success) {
    if (response.data.length > 0) return response.data[0].publicKey;
  }
  return "";
};

const verifyEmailUrl = (passcode) => async (dispatch) => {
  dispatch(actionVerifyEmail(passcode));
};

const resetRerifyEmailUrl = () => async (dispatch) => {
  dispatch(actionResetVerifyEmail());
};

const reVerifyLoginPasscode = (passcode, callBack) => async (dispatch) => {
  try {
    const publicKey = await getDataKeystore("@publicKey");
    const token = await fetchAccessTokens(publicKey, passcode);
    if (token.access_token && token.refresh_token) {
      callBack(true);
    } else {
      callBack(false);
    }
  } catch (error) {
    callBack(false);
  }
};


let globalUserId = "";
const getUserId = () => {
  return globalUserId;
}

const verifyLoginPasscode = (passcode) => async (dispatch) => {
  dispatch(authPending());
  try {
    const publicKey = await getDataKeystore("@userId");
    globalUserId = publicKey;
    const secretKey = await getDataKeystore("@secretKey");
    let walletMainKey = await getDataKeystore("@walletMainKey");
    let isSuccess = true;
    if (publicKey) {
      let token = await fetchAccessTokens(publicKey, passcode);
      if (token.access_token && token.refresh_token) {
        //await insertCurrentDevice(publicKey, token.access_token)
        if (walletMainKey == null) {
          walletMainKey = await fetchMainWalletKey(publicKey);
          if (walletMainKey) await storeKey("@walletMainKey", walletMainKey);
        }

        // store to vault if could not save before
        const keycloarkId =  await getDataKeystore("@keycloarkId");
        if (!keycloarkId) {
          const recoveryHash = await getDataKeystore("@memonic");
          const vaultData = await setupVaultEncryptForSecretKey();
          if (vaultData && vaultData.sub) {
            // update keycloark data
            console.log("call keycloark===", recoveryHash);
            await updateRecoveryInfo(publicKey, vaultData.sub, recoveryHash);
            await storeKey("@keycloarkId", vaultData.sub);
          }
        }

        dispatch(authSuccess(token));
        const reLogin = await getDataKeystore("@reLogin");
        if (reLogin && reLogin == "true") {
          await storeKey("@reLogin", "false");
          NavigationService.goBack();
          return;
        }
        NavigationService.navigate("Main");
        let conversionRate = await fetchTokenPrice();
        if (!conversionRate) conversionRate = 0;
        conversionRate = conversionRate * 100;
        dispatch(tokenConversionSuccess(conversionRate));
      } else {
        isSuccess = false;
      }
    } else {
      isSuccess = false;
    }
    if (!isSuccess) {
      dispatch(
        authFailed({
          NoKeyStorePublicKey: false,
        })
      );
    }
  } catch (error) {
    console.log("verifyLoginPasscode error ", error);
    dispatch(
      authFailed({
        NoKeyStorePublicKey: false,
      })
    );
    Bugfender.e(
      "evtx-login",
      `verifyLoginPasscode failed ${JSON.stringify(error)}`
    );
  }
};

export {
  fetchAccessTokens,
  refreshToken,
  verifyLoginPasscode,
  reVerifyLoginPasscode,
  verifyEmailUrl,
  resetRerifyEmailUrl,
  checkCurrentDevice,
  insertCurrentDevice,
  fetchMainWalletKey,
  getAccessToken,
  getUserId
};
