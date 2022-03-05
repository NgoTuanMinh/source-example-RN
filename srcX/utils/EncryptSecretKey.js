import {NativeModules} from 'react-native';
import bip39 from 'react-native-bip39'
var Aes = NativeModules.Aes
const iv_string = "0123456789abcdef0123456789abcdef"
const passwordDefault = "eventX@gmail.com"
const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length)
const encryptData = (text, key) => {
    return Aes.encrypt(text, key, iv_string).then((cipher) => ({
        cipher
    }))
}
const decryptData = (cipher, key, iv) => Aes.decrypt(cipher, key, iv)


const AESEncrypt = async (password, secretKey)  => {
    try {
      password = (password == "")? passwordDefault : password
      let encryptKey = await generateKey(password, 'SALT', 1000, 256)
      let cipher = await encryptData(secretKey, encryptKey, iv_string)
      return cipher
    } catch (e) {
        console.error(e)
        return ""
    }
}

const AESDecrypt = async (password, cipherEncrypt) => {
    password = (password == "") ? passwordDefault : password
    let encryptKey = await generateKey(password, 'SALT', 1000, 256)
    try {
        var decrypt_string = await decryptData(cipherEncrypt, encryptKey, iv_string);
        return decrypt_string
    } catch (error) {
        console.log("Error", error)
        return ""
    }
    
}

const generateMnemonic = async () => {
    try {
      let memonic = await bip39.generateMnemonic(128)
      return memonic // default to 128
    } catch(e) {
      return false
    }
}

export {
    AESEncrypt,
    AESDecrypt,
    generateMnemonic
}
