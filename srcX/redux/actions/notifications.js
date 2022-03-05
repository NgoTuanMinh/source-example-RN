
import API, { fetchApi } from './api';
import { GET_NOTIFICATIONS_SUCCESS, GET_NOTIFICATIONS_FAILED } from "./actionTypes";
import { getDataKeystore, storeKey } from './keyStore';
import Bugfender from '@bugfender/rn-bugfender';
import StellarSdk from 'stellar-sdk';

const getNotificationsSuccess = payload => {
    return {
        type: GET_NOTIFICATIONS_SUCCESS,
        payload
    }
};

const getNotificationsFailed = payload => ({
    type: GET_NOTIFICATIONS_FAILED,
    payload
});

const setIsLoading = payload => {
    return {
        type: 'IS_LOADING',
        payload,
    }
}

const setNumUnread = payload => {
    return {
        type: 'NUM_UNREAD',
        payload,
    }
}

const actionMinusUnread = payload => {
    return {
        type: 'MINUS_NUM_UNREAD',
        payload,
    }
}

const actionPlusNumUnread = () => {
    return {
        type: 'PLUS_NUM_UNREAD',
    }
}

const fetchNotifications = async (userId, page, limit) => {
    const url = `${API.GET_NOTIFICATION}/notifications/${userId}?page=${page}&limit=${limit}`;
    const response = await fetchApi(url, 'GET');
    return response.data;
};

const fetchUnreadNotification = async (userId) => {
    const url = `${API.GET_NOTIFICATION}/notifications/totalunread/${userId}`;
    const response = await fetchApi(url, 'GET');
    return response.data;
};

const putNotifications = async (ids) => {
    const url = `${API.GET_NOTIFICATION}/notifications/read`;
    const body = {
        ids: ids
    }
    const response = await fetchApi(url, 'POST', body);
    return response;
};

const plusNumUnread = () => async dispatch => {
    dispatch(actionPlusNumUnread());
}
const minusNumUnread = () => async dispatch => {
    dispatch(actionMinusUnread());
}
const getNotifications = (page, limit, callBack) => async dispatch => {
    dispatch(setIsLoading(true));
    const account = await getDataKeystore("@userId");
    if (account) {
        const notifications = await fetchNotifications(account, page, limit);
        if (notifications) {
            dispatch(getNotificationsSuccess(notifications));
        }else {
            dispatch(setIsLoading(false));
            dispatch(getNotificationsFailed(false));
        }
    }
    callBack && callBack();
}

const getNumUnread = () => async dispatch => {
    const userId = await getDataKeystore("@userId");
    if (userId) {
        const numUnread = await fetchUnreadNotification(userId);
        if (numUnread) {
            dispatch(setNumUnread(numUnread));
        }
    }
}

const reSetNoti = () => async dispatch => {
    try {
        dispatch(setNumUnread(-1));
    } catch (error) {
        Bugfender.e("evtx-notifications", `getNumUnread failed error. ${JSON.stringify(error)}`);
    }
}

const setSeeNoti = (payload) => {
    return {
        type: 'IS_SEE',
        payload
    }
}

const setSeeTransferNoti = (payload) => {
    return {
        type: 'IS_SEE_TRANSFER',
        payload
    }
}

const readNotifications = (ids) => async dispatch => {
    if (ids && ids.length) {
        const response = await putNotifications(ids);
        if (response.success)
            dispatch(setSeeNoti(ids[0]));
    }
}


const registerToken = async (body) => {
    try {
        const url = `${API.GET_NOTIFICATION}/register`;
        await fetchApi(url, 'POST', body);
    }
    catch (error) {
    }
};

const submitRegisterToken = async (userId, token, deviceos, devicename) => {
    try {
        const body = {
            userId, 
            "token": token,
            "deviceOs": deviceos,
            "devicename": devicename
        };
        await registerToken(body);
    } catch (error) {
        console.log('submitRegisterToken error ', error);
    }
}

export {
    fetchNotifications,
    submitRegisterToken,
    getNotifications,
    getNumUnread,
    readNotifications,
    plusNumUnread,
    minusNumUnread,
    reSetNoti,
    setSeeTransferNoti
};