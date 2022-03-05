import API, { fetchApi } from "./api";
import {
  GET_WALLETS_SUCCESS,
  PAIR_WALLET_SUCCESS,
  PAIR_WALLET_FAILED,
  GET_PAIRED_WEARABLES,
  RESPONSE_PAIR_WEARBLES,
} from "./actionTypes";
import { getDataKeystore } from "./keyStore";
import StellarSdk from "stellar-sdk";
import NavigationService from "../../NavigationService";

import { fetchMainWalletKey } from "./authAction";
import ErrorCode from "../../constants/ErrorCode";

let walletInitialState = [
  {
    id: 0,
    title: "MainWallet",
    mainPriceCurrency: "X",
    mainPrice: "0",
    secondPrice: "0",
    description: "",
    background: {
      type: "gradient",
      source: "",
    },
    colors: ["#FF6195", "#C2426C"],
    operation: [],
  },
  {
    id: 1,
    title: "Mys19Tokens",
    mainPriceCurrency: "M",
    mainPrice: "0",
    bgImage:
      "https://scrstorage.s3.amazonaws.com/5001b90c347c95069d9d3824d3fc4196.png",
    secondPrice: "0",
    description: "Valid at Mysteryland 2020 until 31 December 2020",
    colors: ["#474747", "#000000"],
    friends: [],
    operation: [],
  },
  {
    id: 2,
    title: "SharedWallet",
    mainPriceCurrency: "X",
    mainPrice: "0",
    secondPrice: "0",
    description: "",
    colors: ["#92A6D8", "#595DAB"],
    shearedMembers: [
      {
        id: 0,
        image:
          "https://scrstorage.s3.amazonaws.com/3398a11a2cb64280d271d0c4ca0d57d9.png",
      },
      {
        id: 1,
        image:
          "https://scrstorage.s3.amazonaws.com/3398a11a2cb64280d271d0c4ca0d57d9345.png",
      },
    ],
    operation: [],
  },
];

const getWalletsSuccess = (payload) => ({
  type: GET_WALLETS_SUCCESS,
  payload,
});

const pairWalletSuccess = (payload) => ({
  type: PAIR_WALLET_SUCCESS,
  payload,
});

const pairWalletFailed = (payload) => ({
  type: PAIR_WALLET_FAILED,
  payload,
});

const getPairedWearablesSuccess = (payload) => ({
  type: GET_PAIRED_WEARABLES,
  payload,
});

const responsePairWearbles = (payload) => ({
  type: RESPONSE_PAIR_WEARBLES,
  payload,
});

const fetchEuroPrice = async () => {
  const response = await fetchApi(`${API.GET_EUR_PRICE}?amount=1`, "GET");
  return response.data;
};

const fetchTokenPrice = async () => {
  const response = await fetchApi(`${API.GET_TOKEN_PRICE}?amount=1`, "GET");
  return response.data;
};

const stellarSign = async (envelope) => {
  const secretKey = await getDataKeystore("@secretKey");
  console.log("Secret key here===", secretKey);
  const tx = new StellarSdk.Transaction(envelope, StellarSdk.Networks.TESTNET);
  const pair = StellarSdk.Keypair.fromSecret(secretKey);
  const signature = tx.getKeypairSignature(pair);
  const hash = tx.hash().toString("hex");
  return { signature, hash };
};

const fetchWalletBalance = async (walletKey) => {
  const url = `${API.WALLETS}/${walletKey}/balance`;
  const response = await fetchApi(url, "GET");
  return response.data;
};

const getWallet = (onSuccess) => async (dispatch) => {
  const walletKey = await getDataKeystore("@walletMainKey");
  if (walletKey) {
    const wallets = await fetchWalletBalance(walletKey);
    const balance = wallets.balance || 0;
    walletInitialState[0].mainPrice = balance;
    walletInitialState[0].secondPrice = balance;
  }
  onSuccess && onSuccess();
  dispatch(getWalletsSuccess(walletInitialState));
};

const submitTransaction = async (url, hash, signature) => {
  const publicKey = await getDataKeystore("@publicKey");
  let body = {
    publicKey,
    hash,
    signature,
  };
  const response = await fetchApi(url, "POST", body);
  return response;
};

const getPairWallet = async (tagId) => {
  const url = `${API.WEARABLES}/${tagId}`;
  const response = await fetchApi(url, "GET");
  return response;
};

const requestPair = async (userId, walletKey, tagId) => {
  const url = `${
    API.WEARABLES
  }/${tagId}/request-pairing/${userId}/${walletKey}`;
  const response = await fetchApi(url, "GET");
  return response;
};

const confirmPair = async (hash, signature) => {
  const url = `${API.WEARABLES}/confirm-pairing`;
  return await submitTransaction(url, hash, signature);
};

const requestUnPair = async (tagId) => {
  const url = `${API.WEARABLES}/${tagId}/request-unpairing`;
  const response = await fetchApi(url, "GET");
  return response;
};

const confirmUnPair = async (hash, signature) => {
  const url = `${API.WEARABLES}/confirm-unpairing`;
  return await submitTransaction(url, hash, signature);
};

const activePair = async (tagId) => {
  const url = `${API.WEARABLES}/${tagId}/activate`;
  const response = await fetchApi(url, "GET");
  return response;
};

const deActivePair = async (tagId) => {
  const url = `${API.WEARABLES}/${tagId}/deactivate`;
  const response = await fetchApi(url, "GET");
  return response;
};

const transferTokens = async (body) => {
  const url = `${API.TOKEN_TRANSFER}`;
  const response = await fetchApi(url, "POST", body);
  return response;
};

const confirmTransfer = async (hash, signature) => {
  const url = `${API.CONFIRM_TRANSFER}`;
  return await submitTransaction(url, hash, signature);
};

const sendTokens = (destAccount, amount, callBack) => async (dispatch) => {
  const senderWallet = await getDataKeystore("@walletMainKey");
  const receiver = destAccount.id;
  const sender = await getDataKeystore("@userId");
  try {
    let isSuccess = false;
    const receiverWallet = await fetchMainWalletKey(destAccount.id);
    if (senderWallet && receiverWallet) {
      let body = {
        senderWallet,
        receiverWallet,
        sender,
        receiver,
        amount,
      };
      const res = await transferTokens(body);
      if (res.success) {
        const { signature, hash } = await stellarSign(res.data);
        const submitRes = await confirmTransfer(hash, signature);
        if (submitRes.success) {
          let item = {
            amount: body.amount,
            firstName: destAccount.givenName,
            lastName: destAccount.familyName,
          };
          isSuccess = true;
          NavigationService.navigate("TopUpSendSuccess", item);
        }
      }
    }
    callBack(isSuccess);
  } catch (error) {
    console.log(error);
    callBack(false);
  }
};

const pairWallet = (tagId, callBack) => async (dispatch) => {
  if (tagId) {
    let qrCodeResult = { tagId };
    const response = await getPairWallet(tagId);
    const userId = await getDataKeystore("@userId");
    if (!response.success) {
      qrCodeResult.ErrorCode = ErrorCode.Wearable_NotFound;
    } else {
      const wearable = response.data;
      let walletMainKey = await getDataKeystore("@walletMainKey");

      if (!walletMainKey) {
        walletMainKey = await fetchMainWalletKey(userId);
        if (walletMainKey) 
            await storeKey("@walletMainKey", walletMainKey);
      }

      // just do pair if pairedWallet is difference walletkey
      if (wearable.pairedWallet !== walletMainKey) {
        // request pair
        const response = await requestPair(userId, walletMainKey, tagId);
        if (response.success) {
          const xdr = response.data;
          const { signature, hash } = await stellarSign(xdr);
          const submitRes = await confirmPair(hash, signature);
          if (!submitRes.success) {
            qrCodeResult.ErrorCode = ErrorCode.Wearable_OtherInUse;
          } else {
            const wearable = submitRes.data;
            dispatch(getPairedWearables());
            qrCodeResult.wearable = wearable;
          }
        } else {
          qrCodeResult.ErrorCode = response.data.ErrorCode ?? ErrorCode.UnKnown;
        }
      } else {
        qrCodeResult.ErrorCode = ErrorCode.Wearable_AlreadyInUse;
      }
    }
    NavigationService.navigate("ResultScanQrcodeScreen", qrCodeResult);
  }
  callBack();
};

const unPairWallet = (tagId, callBack) => async (dispatch) => {
  if (tagId) {
    const xdr = await requestUnPair(tagId);
    if (xdr.success) {
      const { signature, hash } = await stellarSign(xdr.data);
      const submitRes = await confirmUnPair(hash, signature);
      if (submitRes.stellarErrors || submitRes.stellarErrors == "") {
        alert("Failed to unpair device. Try again.");
      } else {
        alert("Device is successfully unpaired.");
        dispatch(getPairedWearables());
      }
    }
  }
  callBack();
};

const getPairedWearables = () => async (dispatch) => {
  const publicKey = await getDataKeystore("@publicKey");
  if (publicKey) {
    const response = await fetchPairedWearables(publicKey);
    if (response.success) dispatch(getPairedWearablesSuccess(response.data));
  }
};

const activeWearables = (tagId, callBack) => async (dispatch) => {
  console.log("TAGIIDD===", tagId);
  if (tagId) {
    const res = await activePair(tagId);
    console.log("RESPONSE===", res);
    if (res.success) {
      dispatch(getPairedWearables());
    } else {
      alert("Failed to active wearable. Try again.");
    }
  }
  callBack();
};

const deactiveWearables = (tagId, callBack) => async (dispatch) => {
  if (tagId) {
    const res = await deActivePair(tagId);
    if (res.success) {
      dispatch(getPairedWearables());
    } else {
      alert("Failed to active wearable. Try again.");
    }
  }
  callBack();
};

const fetchPairedWearables = async (userId) => {
  return await fetchApi(`${API.WEARABLES}/byuser/${userId}`, "GET");
};

const sentBarAction = async (location) => {
  try {
    const walletKey = await getDataKeystore("@walletMainKey");
    const amount = 5;
    const destinationAccount =
      "GDYCJMSOMX2WBWRQXE6BL5C5LMOBDRKJ4N2EOWK5CAG6C7ALRFC4CLLB";
    const body = {
      destinationAccount: destinationAccount,
      price: 6,
      amount: amount,
      assetCode: "EVTX",
      transactionType: "BAR",
      location: [location.coords.longitude, location.coords.latitude],
      items: [
        {
          sku: "V3ON4001",
          name: "Coca-Cola",
          quantity: 1,
          vat: 21.0,
          price: 2.1,
          tokens: 1,
        },
        {
          sku: "V3ON0001",
          name: "Beer",
          quantity: 2,
          vat: 21.0,
          price: 4.2,
          tokens: 2,
        },
      ],
    };
    const response = await fetchApi(
      `${API.POST_BAR_PAYMENT}/${walletKey}/send`,
      "POST",
      body
    );
    const data = await response.json();
    if (data && data.envelopeXdr) {
      const userId = await getDataKeystore("@userId");
      const senderName = await getDataKeystore("@userName");
      const envelopeXdr = await stellarSign(data.envelopeXdr);
      const objectParam = {
        envelopeXdr: envelopeXdr,
        notification: {
          receiverId: userId,
          senderId: userId,
          senderName: senderName.firstName,
          amount: amount,
        },
      };
      const submitRes = await submitTransaction(walletKey, objectParam);

      if (submitRes.stellarErrors) {
        alert("Barpayment Fail");
      } else {
        alert("Barpayment Successfully");
      }
    } else {
      alert("Barpayment Fail");
    }
  } catch (error) {
    console.log("Barpayment error ", error);
    alert("Barpayment Fail");
  }
};

const getTransactionDetail = async (id) => {
  const url = `${API.GET_TRANSACTION_DETAIL}/${id}`;
  const response = await fetchApi(url, "GET");
  return response.data;
};

const getPendingTransferTransactionTicket = async () => {
  const userId = await getDataKeystore("@userId");
  const url = `${API.GET_PENDING_TRANSFER_TICKET_TRANSACTION}/${userId}`;
  return await fetchApi(url, "GET");
};

export {
  getWallet,
  pairWallet,
  unPairWallet,
  getPairedWearables,
  fetchEuroPrice,
  fetchTokenPrice,
  getPendingTransferTransactionTicket,
  sendTokens,
  sentBarAction,
  activeWearables,
  deactiveWearables,
  stellarSign,
  getTransactionDetail,
};
