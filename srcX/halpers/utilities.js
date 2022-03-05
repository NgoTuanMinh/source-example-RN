import {
  getDataKeystore
} from '../redux/actions/keyStore';

import ErrorCode from '../constants/ErrorCode';
import { translate } from '../../App';
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

export const fixDecimals = (value, decimalPoint = 2) => {
  if (!value) return "0,00";
  let floatValue = parseFloat(value).toFixed(decimalPoint).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  if (decimalPoint == 2) {
    let posiComma = floatValue.length - 3;
    floatValue = floatValue.substring(0, posiComma) + "," + floatValue.substring(posiComma + 1)
  }

  return floatValue;
}

export const fixDecimalsF = (value, decimalPoint = 2) => {
  const svalue = parseFloat(value).toFixed(decimalPoint).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return +(svalue);
}

export const toEuros = async (value, decimalPoint = 2) => {
  let conversionRate = await getDataKeystore("@conversionRate");
  conversionRate = Number(conversionRate);
  value = Number(fixDecimals(value * conversionRate));
  return Number(value);
}

export const imageSources = (imageUrl = '') => [
  {
    uri: imageUrl,
    height: 64,
    width: 64
  },
  {
    uri: imageUrl.replace('.png', '@2.png'),
    height: 128,
    width: 128
  },
  {
    uri: imageUrl.replace('.png', '@3.png'),
    height: 256,
    width: 256
  },
  {
    uri: imageUrl.replace('.png', '@4.png'),
    height: 512,
    width: 512
  }
];

export const getErrorByCode = (errorCode) => {
  let textCode = "Some_Thing_Wrong";
  if (errorCode == ErrorCode.Ticket_QR_Code_Not_Found) 
    textCode = "Invalid_Qrcode";
  else if (errorCode == ErrorCode.Ticket_QR_Code_Already_Checked_In) 
    textCode = "Ticket_Already_Checked_In";
  else if (errorCode == ErrorCode.Ticket_QR_Code_Already_Sell)
    textCode = "Ticket_Already_Sell";
  else if (errorCode == ErrorCode.Ticket_QR_Code_Not_In_Wallet)
    textCode = "Ticket_Not_In_Wallet";
  
  return translate(textCode);
}

export const convertTokensToCurrency = (amount, conversionRate) => {
  const price = amount  / conversionRate;
  return price;
}

export const getEventImage = (event, logoFirst = true) => {
  let image = event.imageUrls && event.imageUrls.length > 0 ? event.imageUrls[0] : event.imageUrl;
  if (logoFirst)
    image = event.logoUrl || image;
  else 
    image = image || event.logoUrl;
  return image;
}

export const makePluralityText = (number, plurality, singular) => {
  if (number === 1)
    return `${singular}`;
  return `${number} ${plurality}`;
}

export const makeSha256 = (data) => {
  return sha256(data).toString(
    CryptoJS.enc.Hex
  );
}

export const makeSha512 = (data) => {
  console.log("Data encrypt here===", data);
  return CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex);
}

