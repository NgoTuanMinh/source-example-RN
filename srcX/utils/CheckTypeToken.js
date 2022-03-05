import React from "react";
import { StyleSheet, Image, Dimensions, Platform } from "react-native";
import CircleIcons from "../components/Icons/CircleIcons";
import * as ImageCustoms from "../components/Icons/CircleIcons";

const renderLeftItem = (userId, data) => {
  let transactionTypeImage = ImageCustoms.icPlus;

  if (data.kind === "PurchaseTransaction") {
    return <Image source={ImageCustoms.icBeer} style={styles.circle} />;
  }

  if (data.kind === "TopupTransaction")
    return <Image source={transactionTypeImage} style={styles.circle} />;

  if (userId == data.receiver) {
    transactionTypeImage = ImageCustoms.iconReceive;
  } else if (userId == data.sender) {
    transactionTypeImage = ImageCustoms.iconSend;
  } else if (data.kind === "BuySaleTicketTransaction" && data.isSoldTicket) {
    transactionTypeImage = ImageCustoms.TicketSold;
  } else if (
    data.kind === "PurchaseTicketTransaction" ||
    data.kind === "BuySaleTicketTransaction"
  ) {
    transactionTypeImage = ImageCustoms.icBuyTicket;
  }

  if (data.kind === "RefundTransaction") {
    return <Image source={ImageCustoms.icTransRefund} style={styles.circle} />;
  }

  return <Image source={transactionTypeImage} style={styles.circle} />;
};

const renderTitleItem = (userId, data) => {
  if (data.kind === "PurchaseTransaction") {
    return "Bar payment";
  }

  if (data.kind === "BuySaleTicketTransaction" && data.isSoldTicket) {
    return "Ticket sold";
  }

  if (
    data.kind === "PurchaseTicketTransaction" ||
    data.kind === "BuySaleTicketTransaction"
  ) {
    return data.eventName;
  }

  if (data.kind === "TopupTransaction") return "Token top-up";

  if (data.kind === "RefundTransaction") {
    return "Token refund";
  }

  if (userId == data.sender) {
    return "Sent to " + data.receiverName;
  } else if (userId == data.receiver) {
    return "Received from " + data.senderName;
  }

  return "";
};

const getNameUser = (userId, data) => {
  if (userId == data.sender) {
    return data.receiverName;
  }
  return data.senderName;
};

const getNameAvatar = (userId, data) => {
  if (userId == data.sender) {
    return data.receiverUrl;
  }
  if (userId == data.receiver) return data.senderUrl;
  return null;
};

const renderTypeItem = (userId, data) => {
  if (
    data.kind === "PurchaseTicketTransaction" ||
    (data.kind === "BuySaleTicketTransaction" && !data.isSoldTicket) ||
    (data.kind === "PurchaseTransaction" && userId === data.buyer)
  )
    return "-";
  if (userId === data.sender) return "-";

  return "";
};

const renderTypeItemDetail = (userId, data) => {
  if (data.kind === "RefundTransaction") {
    return "Refund method";
  }
  if (userId == data.sender) {
    return "Sent to";
  } else if (userId == data.receiver) {
    return "Received from";
  }
  return "";
};

function isIphoneXorAbove() {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      (dimen.height === 896 || dimen.width === 896))
  );
}

export {
  renderTypeItemDetail,
  renderLeftItem,
  renderTitleItem,
  renderTypeItem,
  getNameUser,
  getNameAvatar,
  isIphoneXorAbove,
};

const styles = StyleSheet.create({
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
