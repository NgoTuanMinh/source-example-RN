import * as types from 'store/actions/types';

const initUser = {};

const login = (state = initUser, action: any) => {
	switch (action.type) {
		case types.LOGIN_ACTION: {
			return action.payload;
		}
		default:
			return state;
	}
};

export default login;
