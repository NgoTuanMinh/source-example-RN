import API, { fetchApi } from "./api";
import StellarSdk from "stellar-sdk";
import {
  LOAD_DATA_EVENT,
  TOGGLE_LOADING_EVENTS,
  SET_NUMBER_MY_TICKET,
  SET_NUMBER_SALE_TICKET,
  FOCUS_MY_TICKET,
  SHOW_SCAN_TICKET,
  FOCUS_WALLET,
} from "./actionTypes";
import { getDataKeystore, removeKeystore } from "./keyStore";
import { stellarSign, getPendingTransferTransactionTicket } from "./wallets";
import { fetchMainWalletKey, getUserId } from "./authAction";
import { setSeeTransferNoti } from "./notifications";

const setNumberMyTickets = (payload) => {
  return {
    type: SET_NUMBER_MY_TICKET,
    payload,
  };
};

const setNumberSaleTickets = (payload) => {
  return {
    type: SET_NUMBER_SALE_TICKET,
    payload,
  };
};

const transactionsToggle = () => ({
  type: LOAD_DATA_EVENT,
});

const eventGetData = () => ({
  type: TOGGLE_LOADING_EVENTS,
});

const swtichAction = (isReLoad) => {
  if (isReLoad) {
    return transactionsToggle();
  }
  return eventGetData();
};

const focusMyTicketAction = (payload) => ({
  type: FOCUS_MY_TICKET,
  payload,
});

const showScanTicketAction = (payload) => ({
  type: SHOW_SCAN_TICKET,
  payload,
});

const focusWalletAction = () => ({
  type: FOCUS_WALLET,
});

const focusMyTickets = () => async (dispatch) => {
  dispatch(focusMyTicketAction(true));
};

const focusBlurMyTickets = () => async (dispatch) => {
  dispatch(focusMyTicketAction(false));
};

const setShowScanTicket = (scanTicket) => async (dispatch) => {
  dispatch(showScanTicketAction(scanTicket));
};

const focusWallet = () => async (dispatch) => {
  dispatch(focusWalletAction());
};

const getEventComing = async (page = 1, limit = 5, callBack) => {
  const url = `${API.GET_EVENT_UP_COMING}?page=${page}&limit=${limit}`;
  const response = await fetchApi(url, "GET");
  callBack(response.data);
};

const getEventToday = async (page = 1, limit = 5, callBack) => {
  const url = `${API.GET_EVENT_TODAY}?page=${page}&limit=${limit}`;
  const response = await fetchApi(url, "GET");
  callBack(response.data);
};

const getchGetDetailEvent = async (id, callBack) => {
  const url = `${API.EVENT_URL}/${id}`;
  const response = await fetchApi(url, "GET");
  callBack(response);
};

const getchGetDetailPrivateEvent = async (eventId, seller, callBack) => {
  const userId = await getDataKeystore("@userId");
  const response = await fetchApi(
    `${API.GET_PRIVATE_SELL_FOR_USER}/${userId}/${eventId}/${seller}`,
    "GET"
  );
  const data = response.data;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      // set name
      data[i].translatedName = getTranslatedText(
        data[i].ticketDefinition.name,
        "content"
      );
      // description
      data[i].translatedDescription = getTranslatedText(
        data[i].ticketDefinition.description,
        "content"
      );
    }
  }
  callBack(data);
};

const getPriceRangeInEvent = async (idEvent, callBack) => {
  const url = `${API.TICKET_URL}/${idEvent}/price-range`;
  const response = await fetchApi(url, "GET");
  callBack(response);
};

const getOwnTickets = async (eventId, callBack) => {
  const walletId = await getDataKeystore("@walletMainKey");
  const response = await fetchApi(
    `${API.OWN_TICKETS}/${walletId}/${eventId}`,
    "GET"
  );
  if (response.success) {
    const data = response.data;
    for (let i = 0; i < data.length; i++) {
      data[i].translatedName = getTranslatedText(data[i].name, "content");
    }
    callBack(data);
  } else {
    callBack(null);
  }
};

const getTotalOwnTickets = async (eventId, callBack) => {
  const walletId = await getDataKeystore("@walletMainKey");
  const response = await fetchApi(
    `${API.TOTAL_OWN_TICKETS}/${walletId}/${eventId}`,
    "GET"
  );
  callBack(response);
};

const getListSaleTicket = async (callBack) => {
  const userId = await getDataKeystore("@userId");
  const response = await fetchApi(`${API.SALE_TICKETS}/${userId}`, "GET");
  // console.log(" data", response.data);
  callBack(response.data);
};

const getDetailSaleTicket = async (eventId, callBack) => {
  const userId = await getDataKeystore("@userId");
  const response = await fetchApi(
    `${API.SALE_TICKETS}/${userId}/${eventId}`,
    "GET"
  );
  const data = response.data;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      // set name
      data[i].translatedName = getTranslatedText(data[i].name, "content");
    }
  }

  callBack(data);
};

const getEventTicketDefinitions = async (eventId, callBack) => {
  const url = `${API.TICKET_URL}/${eventId}/ticket-definition`;
  const response = await fetchApi(url, "GET");
  const data = response.data;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      // set name
      data[i].translatedName = getTranslatedText(data[i].name, "content");
      // description
      data[i].translatedDescription = getTranslatedText(
        data[i].description,
        "content"
      );
    }
  }
  callBack({ data });
};

const getEventSellTickets = async (eventId, callBack) => {
  const userId = await getDataKeystore("@userId");
  const url = `${API.SALE_TICKETS_FOR_USER}/${userId}/${eventId}`;
  const response = await fetchApi(url, "GET");
  const data = response.data;
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      // set name
      data[i].ticketDefinition.translatedName = getTranslatedText(
        data[i].ticketDefinition.name,
        "content"
      );
      // description
      data[i].ticketDefinition.translatedDescription = getTranslatedText(
        data[i].ticketDefinition.description,
        "content"
      );
    }
  }
  callBack({ data });
};

const getTicketDefinitions = async (ids, callback) => {
  const body = {
    ids,
  };
  const response = await fetchApi(`${API.GET_TICKET_DEFINITION}`, "POST", body);
  const data = response.data;
  if (data && response.success) {
    for (let i = 0; i < data.length; i++)
      data[i].translatedName = getTranslatedText(data[i].name, "content");
  }
  callback(data);
};

const getTranslatedText = (arr, propertyName) => {
  let data = "";
  if (arr && arr.length > 0) {
    data = arr[0][propertyName];
    const matchItem = arr.filter((n) => n.lang == "en");
    if (matchItem && matchItem[propertyName]) data = matchItem[propertyName];
  }
  return data;
};

const makePresign = async (transactionsToPresign) => {
  const secretKey = await getDataKeystore("@secretKey");
  const presigned = transactionsToPresign.map(toPresign => {
    const tx = new StellarSdk.Transaction(toPresign.xdr, StellarSdk.Networks.TESTNET);
    const pair = StellarSdk.Keypair.fromSecret(secretKey);
    const signature = tx.getKeypairSignature(pair);
    return {xdr: tx.toXDR(), signature, sequenceNumber: toPresign.sequenceNumber}
  });
  return presigned;
};

const buyTicketOfficial = async (tickets, callBack) => {
  if (!tickets || tickets.length == 0) {
    callBack({ success: true });
    return;
  }
  const buyerWallet = await getDataKeystore("@walletMainKey");
  const buyer = await getDataKeystore("@userId");
  let body = {
    tickets,
    buyerWallet,
    buyer,
  };
  const response = await fetchApi(API.BUY_TICKETS_OFFICIAL, "POST", body);
  console.log("Buy ticket====", response);
  let { txXDR, transactionsToPresign } = response.data;
  if (txXDR && response.success) {
    const { signature, hash } = await stellarSign(txXDR);
    const publicKey = await getDataKeystore("@publicKey");
    const presigned = await makePresign(transactionsToPresign);
    const body = {
      hash,
      signature,
      publicKey,
      presigned
    };

    console.log("presigned===", presigned);

    const responseSubmit = await fetchApi(API.SUBMIT_BUY_TICKET, "POST", body);
    console.log("responseSubmit ticket====", responseSubmit);
    callBack(responseSubmit);
  } else {
    callBack(response);
  }
};

const lockTickets = async (ticketInfoList, callBack) => {
  if (!ticketInfoList || ticketInfoList.length == 0) {
    callBack({ success: true });
    return;
  }
  const userId = await getDataKeystore("@userId");

  let body = {
    ticketInfoList,
    userId,
  };
  const response = await fetchApi(API.LOCK_TICKETS, "POST", body);
  callBack(response);
};

const unlockTickets = async () => {
  if (lockedTicketIds && lockedTicketIds.length  > 0) {
    let userId = getUserId();
    if (!userId)
      userId = await getDataKeystore("@userId"); 
    await fetchApi(API.UNLOCK_TICKETS, "POST", { ticketIds: lockedTicketIds, userId });
    removeLockedTickeIds();
  }
};

const buyMarketPlaceTicket = async (tickets, callBack) => {
  if (!tickets || tickets.length == 0) {
    callBack({ success: true });
    return;
  }
  const buyerWallet = await getDataKeystore("@walletMainKey");
  const buyer = await getDataKeystore("@userId");

  let body = {
    tickets,
    buyerWallet,
    buyer,
  };
  const response = await fetchApi(API.BUY_MARKET_PLACE_TICKETS, "POST", body);
  console.log("response data here ===", response.data);
  let { txXDR, transactionsToPresign } = response.data;
  if (txXDR && response.success) {
    const { signature, hash } = await stellarSign(txXDR);
    const publicKey = await getDataKeystore("@publicKey");
    const presigned = await makePresign(transactionsToPresign);

    const body = {
      hash,
      signature,
      publicKey,
      presigned
    };
    const responseSubmit = await fetchApi(
      API.CONFIRM_BUY_MARKET_PLACE_TICKETS,
      "POST",
      body
    );
    console.log("Response buy marketplace responseSubmit===", responseSubmit);
    callBack(responseSubmit);
  } else {
    callBack(response); // check with error here
  }
};
const getMyEventTickets = async () => {
  const walletKey = await getDataKeystore("@walletMainKey");
  const url = `${API.EVENT_TICKETS}/${walletKey}`;
  const response = await fetchApi(url, "GET");
  return response.data;
};

const getAvailableTickets = async (ticketIds, callback, issuerIds) => {
  console.log("TicketIds=====", ticketIds);
  const walletId = await getDataKeystore("@walletMainKey");
  const response = await fetchApi(API.GET_AVAILABLE_TICKETS, "POST", {
    ticketIds,
    walletId,
    issuerIds,
  });
  callback(response);
};

const getDataListTicket = async (callBack) => {
  const eventTickets = await getMyEventTickets();
  callBack(eventTickets);
};

const getPastEvent = async (page, limit, onCallBack) => {
  const walletKey = await getDataKeystore("@walletMainKey");
  const response = await fetchApi(
    `${API.GET_PAST_EVENT}/${walletKey}?page=${page}&limit=${limit}`,
    "GET"
  );
  onCallBack(response.data);
};

const searchEvent = async (
  page = 1,
  limit = 10,
  keyword = null,
  date = null,
  countryCode = null,
  ticketAvailable = false,
  callBack
) => {
  const body = {
    keyword,
    date,
    countryCode,
    ticketAvailable,
  };

  const response = await fetchApi(
    `${API.SEARCH_EVENT}?page=${page}&limit=${limit}`,
    "POST",
    body
  );
  const data = response.data;
  if (data.docs) callBack(data);
  else {
    callBack(response);
  }
};

const sellTicket = async (tickets, saleType, callBack) => {
  const sellerWallet = await getDataKeystore("@walletMainKey");
  const seller = await getDataKeystore("@userId");

  let body = {
    sellerWallet,
    seller,
    tickets,
    saleType,
  };
  const response = await fetchApi(API.REQUEST_SELL_TICKET, "POST", body);
  let txXDR = response.data;
  if (txXDR && response.success) {
    const { signature, hash } = await stellarSign(txXDR);
    const publicKey = await getDataKeystore("@publicKey");

    const body = {
      hash,
      signature,
      publicKey,
    };
    const responseSubmit = await fetchApi(
      API.CONFIRM_RESELL_TICKET,
      "POST",
      body
    );
    callBack(responseSubmit);
  } else {
    callBack(response);
  }
};

const transferTickets = async (issuerIds, receiver, callBack) => {
  const receiverWallet = await fetchMainWalletKey(receiver);
  if (receiverWallet) {
    const senderWallet = await getDataKeystore("@walletMainKey");
    const sender = await getDataKeystore("@userId");
    const body = {
      issuerIds,
      receiver,
      receiverWallet,
      sender,
      senderWallet,
    };
    const response = await fetchApi(API.REQUEST_TRANSFER_TICKET, "POST", body);
    const txXDR = response.data;
    if (txXDR && response.success) {
      const success = await confirmTransferTickets(txXDR, null);
      callBack({ success });
    } else {
      callBack(response);
    }
  } else {
    callBack({ data: { Error: "Could not found receiver's wallet" } });
  }
};
const confirmTransferTickets = async (txXDR, oldHash) => {
  const { signature, hash } = await stellarSign(txXDR);
  const publicKey = await getDataKeystore("@publicKey");
  let body = {
    publicKey,
    signature,
    hash: oldHash ?? hash,
  };

  const responseSubmit = await fetchApi(
    API.SUBMIT_TRANSFER_TICKET,
    "POST",
    body
  );
  return responseSubmit.success;
};

const acceptTransferTicket = (txXDR, oldHash, transactionsToPresign, id, callBack) => async (
  dispatch
) => {
   const responseSubmit = await acceptTransferTicketWithoutCallback(txXDR, oldHash, transactionsToPresign);

  if (id) {
    const status = responseSubmit.success ? "SUBMITTED" : "FAILED";
    // dispatch success or not
    dispatch(setSeeTransferNoti({ id, statusTransfer: status }));
  }
  callBack({ success: responseSubmit.success });
};

const acceptTransferTicketWithoutCallback = async(txXDR, oldHash, transactionsToPresign) => {
  console.log("accept transfer ticket-----");
  const { signature, hash } = await stellarSign(txXDR);
  console.log("transactionsToPresign===", transactionsToPresign);
  const publicKey = await getDataKeystore("@publicKey");
  const presigned = await makePresign(transactionsToPresign);
  console.log("presigned===", presigned);
  const body = {
    hash: oldHash,
    signature,
    publicKey,
    presigned
  };

  console.log("do with call api");
  const responseSubmit = await fetchApi(
    API.ACCEPT_TRANSFER_TICKET,
    "POST",
    body
  );

  console.log("response submit===", responseSubmit);
  return responseSubmit;
};

const cancelTransferTicket = (hash, id, reason, callBackSubmit) => async (
  dispatch
) => {
  let body = { hash };
  const url =
    reason === "CANCELLED"
      ? API.CANCEL_TRANSFER_TICKET
      : API.DECLINE_TRANSFER_TICKET;
  let response = await fetchApi(url, "POST", body);
  if (response.success) {
    dispatch(setSeeTransferNoti({ id, statusTransfer: reason }));
    callBackSubmit(response);
  } else {
    callBackSubmit(response);
  }
};

const autoAcceptTransferTicket = async () => {
  const response = await getPendingTransferTransactionTicket();
  if (response.success) {
    const transactions = response.data;
    if (transactions && transactions.length > 0) {
      await Promise.all(
        transactions.map(async (trans) => {
          console.log("Transaction here==", trans);
          await acceptTransferTicketWithoutCallback(trans.xdr, trans.hash, trans.transactionsToPresign);
        })
      );
    }
  }
};

const editSellTickets = async (tickets, callBack) => {
  const sellerWallet = await getDataKeystore("@walletMainKey");
  const seller = await getDataKeystore("@userId");

  let body = {
    sellerWallet,
    seller,
    tickets,
    saleType: tickets.length > 0 ? tickets[0].saleType : "",
  };
  const response = await fetchApi(API.REQUEST_EDITSELL_TICKETS, "POST", body);
  let txXDR = response.data;
  if (txXDR && response.success) {
    const { signature, hash } = await stellarSign(txXDR);
    const publicKey = await getDataKeystore("@publicKey");

    const body = {
      hash,
      signature,
      publicKey,
    };
    const responseSubmit = await fetchApi(
      API.CONFIRM_RESELL_TICKET,
      "POST",
      body
    );
    callBack(responseSubmit);
  } else callBack(response);
};

const requestUnsellTicket = async (issuerIds, callBack) => {
  const body = {
    issuerIds,
  };
  const response = await fetchApi(API.REQUEST_UNSELL_TICKETS, "POST", body);

  let txXDR = response.data;
  if (txXDR && response.success) {
    const { signature, hash } = await stellarSign(txXDR);
    const publicKey = await getDataKeystore("@publicKey");

    const body = {
      hash,
      signature,
      publicKey,
    };
    const responseSubmit = await fetchApi(
      API.CONFIRM_UNSELL_TICKETS,
      "POST",
      body
    );
    callBack(responseSubmit);
  } else callback(response);
};

const getFeeMarket = async (callback) => {
  const urlMain = API.GET_FEE_MARKET;
  const response = await fetchApi(urlMain, "GET");
  if (response.success) {
    callback({ success: true, feeRate: response.data.feeRate });
  }
};

const shareTickets = async (issuerIds, receiver, callBack) => {
  const seller = await getDataKeystore("@userId");
  const body = {
    issuerIds,
    receiver,
    seller,
  };
  const response = await fetchApi(API.SHARE_TICKETS, "POST", body);
  callBack(response);
};

const getQrCode = async (ticketId, callBack) => {
  const url = `${API.GET_QRCODE}/${ticketId}`;
  const response = await fetchApi(url, "GET");
  callBack(response);
};

const checkedInTicket = async (qrCode, callBack) => {
  const body = {
    qrCode,
  };
  const response = await fetchApi(API.CHECK_IN_QRCODE, "POST", body);
  callBack(response);
};

const getEventAddress = (event, isFull = false) => {
  let location = event.address;
  if (event.city) location = `${event.city}`;
  else if (event.state) location = `${event.state}`;
  if (event.country) location = `${location}, ${event.country}`;
  if (isFull && event.address) location = `${event.address}, ${location}`;
  return location;
};

const getProducts = async (ids) => {
  const body = {
    ids,
  };
  const response = await fetchApi(API.GET_PRODUCT_BY_ID, "POST", body);
  if (response.success) {
    for (let i = 0; i < response.data.length; i++) {
      response.data[i].translatedName = getTranslatedText(
        response.data[i].name,
        "content"
      );
    }
  }
  return response;
};
let lockedTicketIds = [];

const addLockedTicketIds = (ticketIds) => {
  lockedTicketIds.push(...ticketIds);
}

const removeLockedTickeIds = () => {
  lockedTicketIds = [];
}

export {
  getchGetDetailEvent,
  getEventTicketDefinitions,
  getEventSellTickets,
  buyTicketOfficial,
  buyMarketPlaceTicket,
  getDataListTicket,
  getEventComing,
  getEventToday,
  getOwnTickets,
  getTotalOwnTickets,
  setNumberMyTickets,
  getPriceRangeInEvent,
  searchEvent,
  sellTicket,
  getListSaleTicket,
  setNumberSaleTickets,
  getDetailSaleTicket,
  transferTickets,
  cancelTransferTicket,
  acceptTransferTicket,
  autoAcceptTransferTicket,
  focusMyTickets,
  focusBlurMyTickets,
  setShowScanTicket,
  getPastEvent,
  editSellTickets,
  requestUnsellTicket,
  shareTickets,
  getchGetDetailPrivateEvent,
  getFeeMarket,
  getTicketDefinitions,
  getEventAddress,
  lockTickets,
  unlockTickets,
  getQrCode,
  checkedInTicket,
  getAvailableTickets,
  getProducts,
  focusWallet,
  addLockedTicketIds,
};
