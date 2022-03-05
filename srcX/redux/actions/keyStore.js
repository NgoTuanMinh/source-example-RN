import AsyncStorage from '@react-native-community/async-storage';

const storeKey =  async (key,value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // console.log('error while storeKey to asyncStorage', e);
    }
};

const getDataKeystore = async key => {
    try {
        const data = await AsyncStorage.getItem(key);
        if (data)
            return JSON.parse(data);
        return null;
    } catch (e) {
        // console.log('error while getting wallet from asyncStorage', e);
    }
};

const removeKeystore = async key => {
    try {
        return await AsyncStorage.removeItem(key);
    } catch (e) {
        // console.log('error while removing key from asyncStorage', e);
    }
};

const resetKeyStore = async () => {
    try {
        await AsyncStorage.clear()
    } catch (e) {
        // console.log('error while resetting resetKeyStore', e);
    }
}

export { storeKey, getDataKeystore, removeKeystore, resetKeyStore };