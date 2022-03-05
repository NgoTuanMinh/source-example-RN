import { getDataKeystore, storeKey, resetKeyStore } from "./keyStore";
import StellarSdk from "stellar-sdk";
import NavigationService from "../../NavigationService";
import API, { fetchApi, fetchWithFormData } from "./api";
import {
  AUTH_SUCCESS,
  AUTH_FAILED,
  SMS_PENDING,
  SMS_SUCCESS,
  SMS_FAILED,
  SET_PHONE,
  SEND_TRANSACTIONS,
  SCREEN_NAME_SUCCESS,
  PIN_VERIFY_SUCCESS,
  PIN_VERIFY_FAILED,
  WALLET_KEY_SUCCESS,
  WALLET_KEY_FAILED,
  PROFILE_PICTURE_UPLOAD_SUCCESS,
  TOKEN_CONVERSION_SUCCESS,
  USER_LOGGED_OUT,
  TOGGLE_LOADING_TRANSACTIONS,
  KEY_PAIR_SUCCESS,
  LOADING_PHONE_NUMBER_SCREEN,
} from "./actionTypes";
import { fetchAccessTokens, fetchTokenPrice } from "./index";
import * as Keychain from "react-native-keychain";
import {
  AESDecrypt,
  AESEncrypt,
  generateMnemonic,
} from "../../utils/EncryptSecretKey";
import * as NewRelicRN from "../../../NewRelicRN";
import { makeSha256, makeSha512 } from "../../halpers/utilities";

let bodyData = "";

const keypairSuccess = (keypair) => {
  return {
    type: KEY_PAIR_SUCCESS,
    keypair,
  };
};

const smsSuccess = (payload) => {
  return {
    type: SMS_SUCCESS,
    payload,
  };
};

const smsPending = (payload) => {
  return {
    type: SMS_PENDING,
    payload,
  };
};

const smsFailed = (payload) => {
  return {
    type: SMS_FAILED,
    payload,
  };
};

const screenNameSuccess = (payload) => {
  return {
    type: SCREEN_NAME_SUCCESS,
    payload,
  };
};

const pinVerifySuccess = (payload) => {
  return {
    type: PIN_VERIFY_SUCCESS,
    payload,
  };
};

const pinVerifyReset = () => {
  return {
    type: "PIN_VERIFY_RESET",
  };
};

const pinVerifyFailed = (payload) => {
  return {
    type: PIN_VERIFY_FAILED,
    payload,
  };
};
const authSuccess = (payload) => {
  return {
    type: AUTH_SUCCESS,
    payload,
  };
};

function authFailed(error) {
  return {
    type: AUTH_FAILED,
    payload: { error },
  };
}

const walletKeySuccess = (payload) => {
  return {
    type: WALLET_KEY_SUCCESS,
    payload,
  };
};

function walletKeyFailed(error) {
  return {
    type: WALLET_KEY_FAILED,
    payload: { error },
  };
}

const tokenConversionSuccess = (payload) => {
  return {
    type: TOKEN_CONVERSION_SUCCESS,
    payload,
  };
};

const profileUploadSuccess = (payload) => ({
  type: PROFILE_PICTURE_UPLOAD_SUCCESS,
  payload,
});

const loading = (payload) => {
  return {
    type: LOADING_PHONE_NUMBER_SCREEN,
    payload,
  };
};

const fetchCreateAccount = async (phoneNumber, publicKey) => {
  const body = {
    phoneNumber: phoneNumber,
    id: publicKey,
  };
  const response = await fetchApi(`${API.REGISTER_ACCOUNT}`, "POST", body);
  return response;
};

const setPasscode = async (username, passcode) => {
  // first get admin token
  const response = await fetchWithFormData(API.GET_ACCESS_TOKEN, "POST", {
    grant_type: "client_credentials",
    client_id: API.CLIENT_ID,
    client_secret: API.CLIENT_SECRET,
  });

  console.log("Response for now=====", response);
  // create a user credentials
  if (response.success) {
    console.log("Create user credentials");
    const body = {
      username,
      credentials: [
        {
          type: "password",
          value: passcode,
          temporary: false,
        },
      ],
      enabled: true,
    };
    const userResponse = await fetchApi(
      API.CREATE_PASSCODE,
      "POST",
      body,
      response.data.access_token
    );
    console.log("Create user credential response=====", userResponse);
    if (!userResponse.success)
      userResponse.data.Error = userResponse.data.errorMessage;
    return userResponse;
  } else {
    return response;
  }
};

const sendSMS = async (phoneNumber) => {
  const url = `${API.SEND_VERIFY_SMS}/${phoneNumber}`;
  const response = await fetchApi(url, "GET");
  return response;
};

const verifySMS = async (phoneNumber, code) => {
  const url = `${API.VERIFY_PHONE_SMS_CODE}/${phoneNumber}`;
  const body = {
    code,
  };
  const response = await fetchApi(url, "POST", body);
  return response;
};

const sendVerifyCode = async (to, via) => {
  let response = {};
  if (via === "sms") response = await sendSMS(to);
  else if (via === "email") response = await updateAndSendEmailCode(to);

  return response;
};

const updateAndSendVerifyCode = async (to, via) => {
  let response = {};
  if (via === "sms") response = await updateAndSendSMS(to);
  else if (via === "email") response = await updateAndSendEmailCode(to);

  return response;
};

const verifyCode = async (to, code, via) => {
  let response = {};
  if (via === "sms") response = await verifySMS(to, code);
  else if (via === "email") response = await verifyEmail(to, code);

  return response;
};

const sendEmailCode = async (email) => {
  const url = `${API.SEND_VERIFY_EMAIL}/${email}`;
  const response = await fetchApi(url, "GET");
  return response;
};

const updateAndSendEmailCode = async (email) => {
  const id = await getDataKeystore("@userId");
  const url = `${API.UPDATE_SEND_VERIFY_EMAIL}`;
  let body = {
    id,
    email,
  };
  const response = await fetchApi(url, "POST", body);
  return response;
};

const updateAndSendSMS = async (phoneNumber) => {
  const id = await getDataKeystore("@userId");
  const url = `${API.UPDATE_SEND_VERIFY_SMS}`;
  let body = {
    id,
    phoneNumber,
  };
  const response = await fetchApi(url, "POST", body);
  return response;
};

const verifyEmail = async (email, code) => {
  const url = `${API.VERIFY_EMAIL_CODE}/${email}`;
  const body = {
    code,
  };
  const response = await fetchApi(url, "POST", body);
  return response;
};

const updateProfile = async (publicKey, body) => {
  const url = `${API.CREATE_ACCOUNT}`;
  let countryOfResidence = "";
  if (body.country && body.country.countryCode)
    countryOfResidence = body.country.countryCode;
  else if (body.countryOfResidence && body.countryOfResidence.countryCode)
    countryOfResidence = body.countryOfResidence.countryCode;

  const currData = {
    firstName: body.firstName,
    lastName: body.lastName,
    nationality: body.nationality.countryCode || "",
    countryOfResidence,
    birthday: body.birthday || body.birthDay || "",
    id: publicKey,
    keycloarkId: bodyData.keycloarkId || "",
    recoveryHashKey: bodyData.recoveryHashKey || "",
  };
  const response = await fetchApi(url, "PATCH", currData);
  return response;
};

const updateRecoveryInfo = async (id, keycloarkId, recoveryHashKey) => {
  const url = `${API.CREATE_ACCOUNT}`;
  const body = {
    id,
    keycloarkId,
    recoveryHashKey,
  };
  const response = await fetchApi(url, "PATCH", body);
  console.log("Response for update recovery info", response);
  return response;
};

const resetPasscode = async (keycloarkId, passCode) => {
  const response = await fetchWithFormData(API.GET_ACCESS_TOKEN, "POST", {
    grant_type: "client_credentials",
    client_id: API.CLIENT_ID,
    client_secret: API.CLIENT_SECRET,
  });

  // create a user credentials
  if (response.success) {
    console.log("Create user credentials", response);
    const body = {
      type: "password",
      value: passCode,
      temporary: false,
    };
    console.log("reset password for===", keycloarkId);
    const userResponse = await fetchApi(
      `${API.CREATE_PASSCODE}/${keycloarkId}/reset-password`,
      "PUT",
      body,
      response.data.access_token
    );

    console.log("reset password reponse is", userResponse);

    return userResponse;
  }
};

// Region for setup secret key
const verifyUserInfoKeycloark = async () => {
  const response = await fetchApi(API.KEYCLOARK_GET_USERINFO, "GET");
  return response;
};

const fetchVaultToken = async () => {
  const jwt = await getDataKeystore("@accesstoken");
  const body = {
    role: "eventx-user",
    jwt,
  };
  const response = await fetchApi(API.VAULT_URL, "POST", body);
  return response;
};

const createVaultSecretKey = async (encryptedKey, upn, vaultToken) => {
  const secretKey = await getDataKeystore("@secretKey");
  const body = {
    data: {
      "stellar-secret": secretKey,
    },
  };

  const response = await fetchApi(
    `${API.VAULT_ENCRYPT_DATA}/${upn}/${encryptedKey}`,
    "POST",
    body,
    vaultToken
  );
  return response;
};

const getVaultSecretKey = async (encryptedKey, upn, vaultToken) => {
  return await fetchApi(
    `${API.VAULT_ENCRYPT_DATA}/${upn}/${encryptedKey}`,
    "GET",
    null,
    vaultToken
  );
};

const setupVaultEncryptForSecretKey = async () => {
  const userInfo = await verifyUserInfoKeycloark();
  if (userInfo.success) {
    const vaultTokenResponse = await fetchVaultToken();
    if (vaultTokenResponse.success) {
      const memoricHashKey = await getDataKeystore("@memonic");
      const encryptDataResponse = await createVaultSecretKey(
        memoricHashKey,
        userInfo.data.upn,
        vaultTokenResponse.data.auth.client_token
      );
      return { success: encryptDataResponse.success, sub: userInfo.data.sub };
    } else {
      return vaultTokenResponse;
    }
  } else {
    return userInfo;
  }
};

const getVaultSecretKeyFlow = async (recoveryHashKey) => {
  console.log("getvault token");
  const userInfo = await verifyUserInfoKeycloark();
  console.log("user info", userInfo);
  if (userInfo.success) {
    const vaultTokenResponse = await fetchVaultToken();
    if (vaultTokenResponse.success) {
      const encryptDataResponse = await getVaultSecretKey(
        recoveryHashKey,
        userInfo.data.upn,
        vaultTokenResponse.data.auth.client_token
      );
      return encryptDataResponse;
    } else {
      return vaultTokenResponse;
    }
  } else {
    return userInfo;
  }
};

const userLoggedOut = () => ({
  type: USER_LOGGED_OUT,
  payload: undefined,
});

const handelLogOut = () => async (dispatch) => {
  dispatch(userLoggedOut());
  NavigationService.navigate("AppStack");
};

const fetchTransactions = async (userId, page = 1, limit = 10) => {
  const url = `${API.GET_TRANSACTIONS}/${userId}?page=${page}&limit=${limit}`;
  const response = await fetchApi(url, "GET");
  // console.log("thai response====", response.data);
  return response.data;
};

const fetchPublicKeyAndSecret = async () => {
  const keyPair = StellarSdk.Keypair.random();
  return {
    publicKey: keyPair.publicKey(),
    secret: keyPair.secret(),
  };
};

const createUserAccount = (phoneNumber) => async (dispatch) => {
  dispatch(smsPending(true));
  try {
    let publicKey = await getDataKeystore("@publicKey");
    let secretKey;
    if (!publicKey) {
      const keypair = await fetchPublicKeyAndSecret();
      publicKey = keypair.publicKey;
      secretKey = keypair.secret;
      // storeKey("@publicKey", publicKey);
      // storeKey("@secretKey", secretKey);
      console.log(
        "evtx-register",
        `publicKey not found in keyStore so creating new`
      );
    }

    console.log(
      "evtx-register",
      `calling fetchCreateAccount with ${publicKey}`
    );
    const accountRes = await fetchCreateAccount(phoneNumber, publicKey);
    if (!accountRes.success) {
      dispatch(smsFailed(accountRes));
      dispatch(loading(false));
      return;
    }

    //if (account.publicKey) {
    await storeKey("@userId", publicKey);
    const response = await sendSMS(phoneNumber);
    if (response.success) {
      dispatch(smsSuccess(response.message));
      NavigationService.navigate("Verification", { publicKey });
      console.log(
        "evtx-register",
        `fetchCreateAccount->sendSMS success ${response.success}`
      );
    } else {
      dispatch(smsFailed(response));
    }
    dispatch(keypairSuccess({ publicKey, secretKey }));
    dispatch(loading(false));
  } catch (error) {
    await resetKeyStore();
    dispatch(smsFailed({ data: "Something wrong, please try again" }));
    dispatch(loading(false));
    console.log(
      "evtx-register",
      `createUserAccount failed ${JSON.stringify(error)}`
    );
  }
};

const showLoading = (isLoading) => async (dispatch) => {
  dispatch(loading(isLoading));
};

const resetCode = () => async (dispatch) => {
  dispatch(pinVerifyReset());
};

const verifyUserAccount = (verificationCode, phoneNumber) => async (
  dispatch
) => {
  dispatch(pinVerifyReset());
  const response = await verifySMS(phoneNumber, verificationCode);
  if (response.success) {
    dispatch(pinVerifySuccess(response));
    NavigationService.navigate("SetFullName");
  } else {
    dispatch(pinVerifyFailed(response));
  }
};

const saveScreenName = (data) => async (dispatch) => {
  bodyData = data;
  await storeKey("@userName", JSON.stringify(data));
  dispatch(screenNameSuccess(bodyData));
  NavigationService.navigate("PassCode", {
    confirm: false,
  });
};

const storeToKeychain = (username, password) => {
  // Store the credentials
  Keychain.setGenericPassword(username, password);
};

const savePasscode = (passcode, keypair) => async (dispatch) => {
  try {
    console.log("Save passcode herer=====", savePasscode);
    let publicKey = keypair.publicKey;
    let secretKey = keypair.secretKey;

    const response = await setPasscode(publicKey, passcode);
    if (response.success) {
      //for faceid
      storeToKeychain(publicKey, passcode);
      //store to keystore publicKey and secretKey
      await storeKey("@publicKey", publicKey);
      await storeKey("@secretKey", secretKey);
      let memonic = await generateMnemonic();
      const recoveryHash = makeSha256(memonic);
      await storeKey("@memonic", recoveryHash);
      const token = await fetchAccessTokens(publicKey, passcode);
      if (token.access_token) {
        dispatch(authSuccess(token));
        // setup vault encrypt token here
        const vaultData = await setupVaultEncryptForSecretKey();
        if (vaultData && vaultData.sub) {
          // update keycloark data
          console.log("call keycloark===", recoveryHash);
          //await updateRecoveryInfo(publicKey, vaultData.sub, recoveryHash);
          bodyData.keycloarkId = vaultData.sub;
          bodyData.recoveryHashKey = recoveryHash;
          await storeKey("@keycloarkId", vaultData.sub);
        }

        // update profile here
        await updateProfile(publicKey, bodyData);

        NavigationService.navigate("FinishRegistration");
        let conversionRate = await fetchTokenPrice();
        if (!conversionRate) conversionRate = 0;
        conversionRate = conversionRate * 100; // convert to correct
        dispatch(tokenConversionSuccess(conversionRate));
      } else {
        dispatch(authFailed("error"));
        dispatch(walletKeyFailed("error"));
      }
    } else {
      dispatch(authFailed(response.data.Error));
      dispatch(walletKeyFailed(response.data.Error));
    }
  } catch (error) {
    dispatch(authFailed(error));
    dispatch(walletKeyFailed(error));
  }
};

const setUserPhone = (payload) => async (dispatch) => {
  dispatch({
    type: SET_PHONE,
    payload,
  });
};

const transactionsSuccess = (payload) => ({
  type: SEND_TRANSACTIONS,
  payload,
});

const transactionsToggle = () => ({
  type: TOGGLE_LOADING_TRANSACTIONS,
});

const transactionsToggleData = () => ({
  type: "LOAD_DATA",
});

const swtichAction = (isReLoad) => {
  if (isReLoad) {
    return transactionsToggleData();
  }
  return transactionsToggle();
};

const getTransactionsOfWallet = (
  page = 1,
  limit = 10,
  isReLoad = false
) => async (dispatch) => {
  dispatch(swtichAction(isReLoad));
  const userId = await getDataKeystore("@userId");

  if (userId) {
    const transactions = await fetchTransactions(userId, page, limit);
    // console.log("thai transssss", transactions);
    dispatch(transactionsSuccess(transactions));
  } else {
    dispatch(swtichAction(isReLoad));
  }
};

const getTransactionsOfWalletNoReload = (
  page = 1,
  limit = 10,
  isReLoad = false
) => async (dispatch) => {
  // dispatch(swtichAction(isReLoad));
  const userId = await getDataKeystore("@userId");
  // console.log("thai 2");
  if (userId) {
    const transactions = await fetchTransactions(userId, page, limit);
    // console.log("thai transssss", transactions);
    dispatch(transactionsSuccess(transactions));
  } else {
    dispatch(swtichAction(isReLoad));
  }
};

const updateProfileDetails = (body) => async (dispatch) => {
  const userId = await getDataKeystore("@userId");
  const profile = await updateProfile(userId, body);
  if (profile.success) {
    await storeKey("@userName", JSON.stringify(body));
    dispatch(profileUploadSuccess(profile.data));
    NavigationService.goBack();
  }
};

export {
  setUserPhone,
  createUserAccount,
  verifyUserAccount,
  saveScreenName,
  savePasscode,
  getTransactionsOfWallet,
  updateProfileDetails,
  userLoggedOut,
  handelLogOut,
  sendVerifyCode,
  updateAndSendVerifyCode,
  sendEmailCode,
  verifyCode,
  resetCode,
  showLoading,
  sendSMS,
  setupVaultEncryptForSecretKey,
  getVaultSecretKeyFlow,
  updateRecoveryInfo,
  resetPasscode,
  getTransactionsOfWalletNoReload,
};
