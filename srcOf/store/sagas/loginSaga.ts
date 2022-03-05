import { takeLatest } from 'redux-saga/effects';
import * as types from 'store/actions/types';

function* loginSaga() {

}

export function* watchLogin() {
	yield takeLatest(types.LOGIN_ACTION, loginSaga);
}
