import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import login from 'store/reducers/loginReducer';
import { watchLogin } from 'store/sagas/loginSaga';

export default {
	rootReducer: combineReducers({
		login,
	})
};

export function* rootSaga() {
	yield all([
		watchLogin(),
	]);
};
