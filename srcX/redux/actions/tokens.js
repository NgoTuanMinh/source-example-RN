
import API, { fetchApi } from './api';
import { BUY_TOKENS_SUCCESS } from "./actionTypes";
import {
    getDataKeystore, storeKey
} from './keyStore';
import { Linking } from "react-native";
import NavigationService from '../../NavigationService';
import Bugfender from '@bugfender/rn-bugfender';
import { fetchMainWalletKey } from './authAction';
import { stellarSign } from './wallets';

let pendingTopupHash = '';

const buyTokensSuccess = payload => ({
    type: BUY_TOKENS_SUCCESS,
    payload
})

const buyTokensError = payload => ({
    type: "BUY_TOKENS_ERROR",
})

const resetPayToken = payload => ({
    type: "RESET_PAY_TOKEN",
})

const resetPaymentToken = () => async dispatch => {
    dispatch(resetPayToken());
}

const mangopayTopup = async (tokenAmount, cardType) => {
    const userId = await getDataKeystore("@userId");
    let walletId = await getDataKeystore("@walletMainKey");

    if (!walletId) {
        walletId = await fetchMainWalletKey(userId);
        if (walletId) 
            await storeKey("@walletMainKey", walletId);
    }

    let body = {
        userId,
        walletId,
        tokenAmount,
        cardType
    };
    const url = API.IDEAL_TOPUP;
    const response = await fetchApi(url, 'POST', body);
    return response.data;
};

const buyTokens = (tokenAmt, cardType) => async dispatch => {
    let response = await mangopayTopup(tokenAmt, cardType);
    if(response.PaymentUrl){
        console.log("Hash data==", response.hash);
        response.tokenAmount = tokenAmt;
        pendingTopupHash = response.hash;
        dispatch(buyTokensSuccess(response))
    }else{
        dispatch(buyTokensError())
    }
}

const deletePendingTopUpTransaction = async() => {
    if (pendingTopupHash) {
        await fetchApi(`${API.DELETE_PENDING_TRANSACTION}/${pendingTopupHash}`, 'DELETE');
    }
    pendingTopupHash = '';
}

const refundToken = async (tokenAmount, payinId, callBack) => {
    const body = {
        tokenAmount,
        payinId
    }
    const response = await fetchApi(API.REQUEST_REFUND, 'POST', body);

    let txXDR = response.data;
    if (txXDR && response.success) {
        const { signature, hash } = await stellarSign(txXDR);
        const publicKey =  await getDataKeystore("@publicKey");

        const body = {
            hash,
            signature,
            publicKey
        };
        const responseSubmit = await fetchApi(API.CONFIRM_REFUND, 'POST', body);
        console.log("Response Submit===", responseSubmit);
        callBack(responseSubmit);
    }else 
        callBack(response);
}

const refundFee = async(callback) => {
    const response = await fetchApi(API.GET_REFUND_FEE, 'GET');
    callback(response);
}

export { buyTokens, resetPaymentToken, refundToken, refundFee, deletePendingTopUpTransaction };