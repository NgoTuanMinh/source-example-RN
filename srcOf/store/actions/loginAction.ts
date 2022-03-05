import { LOGIN_ACTION } from './types';

export const loginAction = (params: any, onSuccess: Function, onError: Function) => ({
	type: LOGIN_ACTION,
	params,
	onSuccess,
	onError
});