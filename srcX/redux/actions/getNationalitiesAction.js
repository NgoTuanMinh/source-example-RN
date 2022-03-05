
import API from './api';
import {GET_CONTACTS_SUCCESS} from "./actionTypes";

const getNationalitiesSuccess = payload  => ({
    type: GET_CONTACTS_SUCCESS,
    payload
});

const fetchGetNationalities = (data) => async dispatch => {
    const body = {

    }
    const url = ``

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${access_token}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    if(result) {
      dispatch(getNationalitiesSuccess(result))
    }
};

export {
  fetchGetNationalities
}