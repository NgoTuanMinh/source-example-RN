import AsyncStorage from '@react-native-community/async-storage';

const USER_TOKEN = 'USER_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const USER_DATA = 'USER_DATA';

export const clearUserData = async () => {
	try {
		await AsyncStorage.removeItem(`@${USER_TOKEN}:key`);
		await AsyncStorage.removeItem(`@${USER_DATA}:key`);
		await AsyncStorage.removeItem(`@${REFRESH_TOKEN}:key`);
		return true;
	} catch (error) {
		return false;
	}
};

export const saveUserData = async (value: string) => {
	try {
		await AsyncStorage.setItem(`@${USER_DATA}:key`, `${value}`);
		return true;
	} catch (error) {
		return false;
	}
};

export const getUserData = async () => {
	try {
		const value = await AsyncStorage.getItem(`@${USER_DATA}:key`);
		if (value !== null) {
			return JSON.parse(value);
		}
		return false;
	} catch (error) {
		return false;
	}
};

export const saveAccessToken = async (value: string) => {
	try {
		await AsyncStorage.setItem(`@${USER_TOKEN}:key`, `${value}`);
		return true;
	} catch (error) {
		return false;
	}
	
};

export const getAccessToken = async () => {
	try {
		const value = await AsyncStorage.getItem(`@${USER_TOKEN}:key`);
		if (value !== null) {
			return value;
		}
		return '';
	} catch (error) {
		return '';
	}
};

export const saveRefreshToken = async (value: string) => {
	try {
		await AsyncStorage.setItem(`@${REFRESH_TOKEN}:key`, `${value}`);
		return true;
	} catch (error) {
		return false;
	}
};

export const getRefreshToken = async () => {
	try {
		const value = await AsyncStorage.getItem(`@${REFRESH_TOKEN}:key`);
		if (value !== null) {
			return JSON.parse(value);
		}
		return false;
	} catch (error) {
		return false;
	}
};
