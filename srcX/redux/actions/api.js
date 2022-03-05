import { method, result } from "lodash";
import { request } from "react-native-permissions";
import { getDataKeystore, storeKey } from "./keyStore";
import NavigationService from "../../NavigationService";
import { refreshToken, getAccessToken } from ".";
/* eslint-disable prettier/prettier */
const env = {
  dev: "dev",
  test: "test",
  stg: "stg",
  product: "product",
  local: "local",
};

const BASE_URL = {
  local: "http://dev-phucduong.ap.ngrok.io/",
  product: "http://api.acceptance.eventx.network/",
};

// const currentEnv = env.local;
const currentEnv = env.product;
export const BASE_API_URL = BASE_URL[currentEnv];

const GET_API_HOST = BASE_API_URL;

// account manager
const ACCOUNT_MANAGER = `${BASE_API_URL}accountmanager`;
const CREATE_ACCOUNT = `${ACCOUNT_MANAGER}/accounts`;
const KEYCLOARK_URL = `${BASE_API_URL}auth/realms/eventx/protocol/openid-connect`;
const GET_ACCESS_TOKEN = `${KEYCLOARK_URL}/token`;
const KEYCLOARK_GET_USERINFO = `${KEYCLOARK_URL}/userinfo`;
const VAULT_URL = `${BASE_API_URL}vault/auth/jwt/login`;
const VAULT_ENCRYPT_DATA = `${BASE_API_URL}vault/user-kv/data`;
const REGISTER_ACCOUNT = `${ACCOUNT_MANAGER}/register`;
const CREATE_PASSCODE = `${BASE_API_URL}auth/admin/realms/eventx/users`;
const CLIENT_ID = "eventx-platform";
const CLIENT_SECRET = "745794ac-3154-4bc1-a344-ac64c53fa71e";
const SEND_VERIFY_SMS = `${ACCOUNT_MANAGER}/verification/phone/send-code`;
const VERIFY_PHONE_SMS_CODE = `${ACCOUNT_MANAGER}/verification/phone/verify-code`;
const SEND_VERIFY_EMAIL = `${ACCOUNT_MANAGER}/verification/email/send-code`;
const UPDATE_SEND_VERIFY_EMAIL = `${ACCOUNT_MANAGER}/verification/email/update-and-send-code`;
const UPDATE_SEND_VERIFY_SMS = `${ACCOUNT_MANAGER}/verification/phone/update-and-send-code`;
const VERIFY_EMAIL_CODE = `${ACCOUNT_MANAGER}/verification/email/verify-code`;
const RECOVERY = `${ACCOUNT_MANAGER}/recovery`;
const SEND_RECOVERY_SMS = `${RECOVERY}/phone/send-code`;
const SEND_RECOVERY_EMAIL = `${RECOVERY}/email/send-code`;
const VERIFY_RECOVERY_SMS = `${RECOVERY}/phone/verify-code`;
const VERIFY_RECOVERY_EMAIL = `${RECOVERY}/email/verify-code`;

const STELLARMANAGER = `${BASE_API_URL}stellarmanager`;
const WALLETS = `${STELLARMANAGER}/wallets`;
const TRANSACTIONS = `${STELLARMANAGER}/transactions`;
const GET_TRANSACTIONS = `${TRANSACTIONS}/user`;
const GET_TRANSACTION_DETAIL = `${TRANSACTIONS}/detail`;
const GET_PENDING_TRANSFER_TICKET_TRANSACTION = `${TRANSACTIONS}/user/pending-transfer-ticket`;
const DELETE_PENDING_TRANSACTION = `${TRANSACTIONS}/byhash`;

const TOKEN_TRANSFER = `${STELLARMANAGER}/request-transfer`;
const CONFIRM_TRANSFER = `${STELLARMANAGER}/confirm-transfer`;
const WEARABLES = `${STELLARMANAGER}/wearables`;
const MARKETPLACE = `${STELLARMANAGER}/marketplace/tickets`;
const REQUEST_SELL_TICKET = `${MARKETPLACE}/request-sell`;
const CONFIRM_RESELL_TICKET = `${MARKETPLACE}/confirm-sell`;
const REQUEST_UNSELL_TICKETS = `${MARKETPLACE}/request-unsell`;
const CONFIRM_UNSELL_TICKETS = `${MARKETPLACE}/confirm-unsell`;
const REQUEST_EDITSELL_TICKETS = `${MARKETPLACE}/request-edit-sell`;
const SHARE_TICKETS = `${MARKETPLACE}/share`;

// call in fiatgateway
const FIAT_GATEWAY = `${BASE_API_URL}fiatgateway`;
const IDEAL_TOPUP = `${FIAT_GATEWAY}/topup/web`;
const GET_EUR_PRICE = `${FIAT_GATEWAY}/sdr/EUR/convert-to-currency`;
const GET_TOKEN_PRICE = `${FIAT_GATEWAY}/sdr/EUR/convert-to-tokens`;
const REQUEST_REFUND = `${FIAT_GATEWAY}/topup/request-refund`;
const CONFIRM_REFUND = `${FIAT_GATEWAY}/topup/confirm-refund`;
const GET_REFUND_FEE = `${FIAT_GATEWAY}/topup/refund-fee`;

const CONTACTS_LOOKUP = `${ACCOUNT_MANAGER}/accounts/reverse-phone-lookup`;
const GET_NOTIFICATION = `${BASE_API_URL}notificationmanager`;

const EVENT_MANAGER = `${BASE_API_URL}eventmanager`;
const EVENT_URL = `${EVENT_MANAGER}/events`;
const GET_EVENT_TODAY = `${EVENT_URL}/today-events`;
const GET_EVENT_UP_COMING = `${EVENT_URL}/up-coming-events`;
const SEARCH_EVENT = `${EVENT_URL}/search-events`;
const TICKET_URL = `${EVENT_MANAGER}/tickets`;
const LOCK_TICKETS = `${TICKET_URL}/lock-tickets`;
const UNLOCK_TICKETS = `${TICKET_URL}/unlock-tickets`;
const BUY_TICKETS_OFFICIAL = `${TICKET_URL}/request-purchase`;
const BUY_MARKET_PLACE_TICKETS = `${MARKETPLACE}/request-buy`;
const CONFIRM_BUY_MARKET_PLACE_TICKETS = `${MARKETPLACE}/confirm-buy`;
const SUBMIT_BUY_TICKET = `${TICKET_URL}/confirm-purchase`;
const EVENT_TICKETS = `${TICKET_URL}/events`;
const GET_PAST_EVENT = `${TICKET_URL}/past-events`;
const GET_AVAILABLE_TICKETS = `${TICKET_URL}/available-tickets`;
const OWN_TICKETS = `${EVENT_TICKETS}/own-tickets`;
const TOTAL_OWN_TICKETS = `${EVENT_TICKETS}/own-tickets-total`;
const SALE_TICKETS = `${EVENT_TICKETS}/sale-tickets`;
const SALE_TICKETS_FOR_USER = `${EVENT_TICKETS}/user-sale-tickets`;
const GET_PRIVATE_SELL_FOR_USER = `${EVENT_TICKETS}/user-private-tickets`;
const REQUEST_TRANSFER_TICKET = `${STELLARMANAGER}/tickets/request-transfer`;
const SUBMIT_TRANSFER_TICKET = `${STELLARMANAGER}/tickets/confirm-transfer`;
const ACCEPT_TRANSFER_TICKET = `${STELLARMANAGER}/tickets/accept-transfer`;
const CANCEL_TRANSFER_TICKET = `${STELLARMANAGER}/tickets/cancel-transfer`;
const DECLINE_TRANSFER_TICKET = `${STELLARMANAGER}/tickets/decline-transfer`;
const GET_FEE_MARKET = `${STELLARMANAGER}/marketplace/fee-rate`;
const GET_TICKET_DEFINITION = `${TICKET_URL}/get-many`;
const GET_QRCODE = `${TICKET_URL}/qr-code`;
const CHECK_IN_QRCODE = `${TICKET_URL}/check-in-ticket`;
const GET_PRODUCT_BY_ID = `${EVENT_MANAGER}/products/get-by-ids`;

const GET_TOKEN = `${BASE_API_URL}oauth2/token`;
const POST_BAR_PAYMENT = BASE_API_URL + "v1/wallets";

export const uploadFile = async (url, method, formdata) => {
  try {
    let access_token = getAccessToken();
    if (!access_token) access_token = await getDataKeystore("@accesstoken");
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_token}`,
      },
      body: formdata,
    });
    const data = await processHttpResponse(response);
    // this is refresh
    if (data.isRefresh) {
      if (data.success) {
        // retried get data again
        return await uploadFile(url, method, formdata);
      } else {
        // otherwise refreshtoken not success
        NavigationService.navigate("Login");
      }
    } else {
      return data;
    }
  } catch (error) {
    return processHttpException(error);
  }
};

export const fetchApi = async (
  url,
  method,
  body = null,
  access_token = null
) => {
  try {
    let token = access_token;
    if (!token) token = getAccessToken();
    if (!token) token = await getDataKeystore("@accesstoken");
    let requestInfo = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (body) {
      requestInfo.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestInfo);
    const data = await processHttpResponse(response, false);
    // this is refresh
    if (data.isRefresh) {
      if (data.success) {
        // retried get data again
        return await fetchApi(url, method, body);
      } else {
        // otherwise refreshtoken not success
        NavigationService.navigate("AppStack");
      }
    } else {
      return data;
    }
  } catch (error) {
    // console.log("Make process error===", error);
    return processHttpException(error);
  }
};

export const fetchWithFormData = async (url, method, details, isRefresh) => {
  try {
    let access_token = getAccessToken();
    if (!access_token) access_token = await getDataKeystore("@accesstoken");
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });
    const data = await processHttpResponse(response, isRefresh);
    // this is refresh
    if (data.isRefresh) {
      if (data.success) {
        return await fetchWithFormData(url, method, details, false);
      } else {
        // otherwise refreshtoken not success
        NavigationService.navigate("AppStack");
      }
    } else {
      return data;
    }
  } catch (error) {
    return processHttpException(error);
  }
};

const processHttpResponse = async (response, isRefresh) => {
  let result = {};
  const text = await response.text();
  if (response.status === 403) {
    result.isRefresh = true;
    if (!isRefresh) {
      const data = await refreshToken();
      result.success = data.success;
    }
    //
  } else {
    result.success =
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204;
    // set 403 for permission denied
    if (text.length > 0) {
      const data = JSON.parse(text);
      if (!result.success && !data.Error) {
        result.data = { Error: data };
      } else {
        result.data = data;
      }
    }
  }
  return result;
};

const processHttpException = (error) => {
  let result = {};
  result.success = false;
  result.data = { Error: "Something wrong, please try again" };
  return result;
};

export default {
  GET_API_HOST,
  CREATE_ACCOUNT,
  GET_ACCESS_TOKEN,
  REGISTER_ACCOUNT,
  CREATE_PASSCODE,
  KEYCLOARK_GET_USERINFO,
  VAULT_URL,
  VAULT_ENCRYPT_DATA,
  CLIENT_ID,
  CLIENT_SECRET,
  SEND_VERIFY_SMS,
  VERIFY_PHONE_SMS_CODE,
  SEND_VERIFY_EMAIL,
  VERIFY_EMAIL_CODE,
  SEND_RECOVERY_SMS,
  SEND_RECOVERY_EMAIL,
  VERIFY_RECOVERY_SMS,
  VERIFY_RECOVERY_EMAIL,
  UPDATE_SEND_VERIFY_EMAIL,
  UPDATE_SEND_VERIFY_SMS,
  GET_TRANSACTIONS,
  GET_PENDING_TRANSFER_TICKET_TRANSACTION,
  TOKEN_TRANSFER,
  CONFIRM_TRANSFER,
  WALLETS,
  GET_TOKEN,
  IDEAL_TOPUP,
  REQUEST_REFUND,
  CONFIRM_REFUND,
  GET_REFUND_FEE,
  WEARABLES,
  CONTACTS_LOOKUP,
  GET_EUR_PRICE,
  GET_TOKEN_PRICE,
  GET_NOTIFICATION,
  GET_TRANSACTION_DETAIL,
  POST_BAR_PAYMENT,
  BUY_TICKETS_OFFICIAL,
  EVENT_MANAGER,
  EVENT_URL,
  GET_EVENT_TODAY,
  GET_EVENT_UP_COMING,
  TICKET_URL,
  OWN_TICKETS,
  TOTAL_OWN_TICKETS,
  EVENT_TICKETS,
  SUBMIT_BUY_TICKET,
  SEARCH_EVENT,
  SALE_TICKETS,
  SALE_TICKETS_FOR_USER,
  REQUEST_TRANSFER_TICKET,
  SUBMIT_TRANSFER_TICKET,
  ACCEPT_TRANSFER_TICKET,
  CANCEL_TRANSFER_TICKET,
  DECLINE_TRANSFER_TICKET,
  REQUEST_SELL_TICKET,
  REQUEST_EDITSELL_TICKETS,
  CONFIRM_RESELL_TICKET,
  REQUEST_UNSELL_TICKETS,
  CONFIRM_UNSELL_TICKETS,
  BUY_MARKET_PLACE_TICKETS,
  CONFIRM_BUY_MARKET_PLACE_TICKETS,
  SHARE_TICKETS,
  GET_PAST_EVENT,
  GET_PRIVATE_SELL_FOR_USER,
  GET_FEE_MARKET,
  GET_TICKET_DEFINITION,
  LOCK_TICKETS,
  UNLOCK_TICKETS,
  GET_QRCODE,
  CHECK_IN_QRCODE,
  GET_AVAILABLE_TICKETS,
  GET_PRODUCT_BY_ID,
  DELETE_PENDING_TRANSACTION,
};
