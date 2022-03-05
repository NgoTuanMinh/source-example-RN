import React from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import ToiletSVG from "./ToiletSVG";
import BarSVG from "./BarSVG";
import ParkingSVG from "./ParkingSVG";
import SplitSVG from "./SplitSVG";
import TicketSVG from "./TicketSVG";
import WearableSVG from "./WearableSVG";
import ShareSVG from "./ShareSVG";
import LogoSVG from "./LogoSVG";
import DetailsSVG from "./DetailsSVG";
import PlusSVG from "./PlusSvg";
import SettingsIcon from "../Svg/SettingsIcon";
import WalletInfo from "../Svg/WalletInfo";
import FaceIdIcon from "../Svg/FaceIdIcon";
import TicketScannerSVG from "./TicketScannerSVG";
import InviteCrewSVG from "./InviteCrewSVG";

export const IcSecuritySvg = "../../../../assets/images/svg/icSecurity.svg";
// import icWifiSvg from '../Svg/icWifi';
// import icContactSvg from '../Svg/icContact';
// import icHeadphoneSvg from '../Svg/icHeadphone';
// import logoutSvg from '../Svg/logout';

import AddUserIcon from "./AddUserIcon";
import CartSVG from "./CartSVG";
import ArrowRightSVG from "./ArrowRightSVG";
import RequestIcon from "./RequestIcon";
import RefoundIcon from "./RefoundIcon";
import LogoRegularIcon from "./LogoRegularIcon";

export const icSecurity = require("../../../../assets/images/icSecurity.png");
export const icWifi = require("../../../../assets/images/icWifi.png");
export const icContact = require("../../../../assets/images/icContact.png");
export const icHeadphone = require("../../../../assets/images/icHeadphone.png");
export const icNotify = require("../../../../assets/images/icNotify.png");
export const icSearch = require("../../../../assets/images/icSearch.png");
export const icBack = require("../../../../assets/images/icBack.png");
export const icPhone = require("../../../../assets/images/icPhone.png");
export const icSuccess = require("../../../../assets/images/icSuccess.png");
export const icGrayPen = require("../../../../assets/images/icGrayPen.png");
export const icMail = require("../../../../assets/images/icMail.png");
export const icWarning = require("../../../../assets/images/icWarning.png");
export const icDropdown = require("../../../../assets/images/icDropdown.png");
export const iconSend = require("../../../../assets/images/iconSend.png");
export const iconReceive = require("../../../../assets/images/iconReceive.png");
export const icPlus = require("../../../../assets/images/icPlus.png");
export const icPlusWhite = require("../../../../assets/images/icPlusWhite.png");
export const icCreditCard = require("../../../../assets/images/icCreditCard.png");
export const defaulImage = require("../../../../assets/images/defaulImage.png");
export const icBeer = require("../../../../assets/images/Beer.png");
export const icShare = require("../../../../assets/images/icShare.png");
export const icRefund = require("../../../../assets/images/icRefund.png");
export const icCheck = require("../../../../assets/images/icCheck.png");
export const icChecked = require("../../../../assets/images/icChecked.png");
export const icSplitBill = require("../../../../assets/images/icSplitBill.png");
export const icDotHorizontal = require("../../../../assets/images/icDotHorizontal.png");
export const icCalendar = require("../../../../assets/images/icCalendar.png");
export const icLocation = require("../../../../assets/images/icLocation.png");
export const icMapPin = require("../../../../assets/images/map-pin.png");
export const union = require("../../../../assets/images/Union.png");
export const icMapPinDefault = require("../../../../assets/images/marker-default.png");
export const icPlusNumber = require("../../../../assets/images/icPlusNumber.png");
export const icMinus = require("../../../../assets/images/icMinus.png");
export const icBackupWallet = require("../../../../assets/images/icBackupWallet.png");
export const icAvatar = require("../../../../assets/images/avatar.png");
export const icRadio = require("../../../../assets/images/icRadio.png");
export const icUndrawOrderConfirmed = require("../../../../assets/images/undraw_order_confirmed.png");
export const qrCodeFail = require("../../../../assets/images/qrCodeFail.png");
export const icTrash = require("../../../../assets/images/icTrash.png");
export const icTick = require("../../../../assets/images/icTick.png");
export const icx = require("../../../../assets/images/icx.png");
export const icWearables = require("../../../../assets/images/wearables.png");
export const icItemEventX = require("../../../../assets/images/icItemEventX.png");
export const icBoardTicket = require("../../../../assets/images/icBoardTicket.png");
export const icTickets = require("../../../../assets/images/icTickets.png");
export const icShareDot = require("../../../../assets/images/icShareDot.png");
export const icEditWhite = require("../../../../assets/images/icEditWhite.png");
export const iconEvent = require("../../../../assets/images/iconEvent.png");
export const icNumberTickets = require("../../../../assets/images/icNumberTickets.png");
export const icBgEvent = require("../../../../assets/images/icBgEvent.png");
export const EventThumbnail = require("../../../../assets/images/EventThumbnail.png");
export const icCurrentLocation = require("../../../../assets/images/icCurrentLocation.png");
export const icNumberGrayTickets = require("../../../../assets/images/icNumberGrayTickets.png");
export const icBuyTicket = require("../../../../assets/images/icBuyTicket.png");
export const TicketSold = require("../../../../assets/images/TicketSold.png");
export const icTransRefund = require("../../../../assets/images/icTransRefund.png");

const styles = StyleSheet.create({
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
  },
});

const Icon = ({ name, color = "#fff", size }) => {
  switch (name) {
    case "toilet":
      return <ToiletSVG color={color} />;

    case "bar":
      return <BarSVG color={color} />;

    case "parking":
      return <ParkingSVG color={color} />;

    case "split":
      return <SplitSVG color={color} />;

    case "ticket":
      return <TicketSVG color={color} />;

    case "wearable":
      return <WearableSVG color={color} />;

    case "share":
      return <ShareSVG color={color} />;

    case "logo":
      return <LogoSVG color={color} size={size} />;

    case "logo-regular":
      return <LogoRegularIcon color={color} size={size} />;

    case "details":
      return <DetailsSVG color={color} />;

    case "settings":
      return <SettingsIcon color={color} />;

    case "wallet-info":
      return <WalletInfo color={color} />;

    case "face-id":
      return <FaceIdIcon color={color} />;

    case "add-user":
      return <AddUserIcon color={color} size={size} />;

    case "cart":
      return <CartSVG color={color} />;

    case "arrow-right":
      return <ArrowRightSVG color={color} size={size} />;

    case "request":
      return <RequestIcon color={color} />;

    case "refound":
      return <RefoundIcon color={color} />;

    case "plus":
      return <PlusSVG color={color} />;
    case "ticket-scanner":
      return <TicketScannerSVG color={color} />;
    case "invite-crew":
      return <InviteCrewSVG color={color} />;

    default:
      return null;
  }
};

const CircleIcons = (props) => {
  const { background, content, iconContainerStyles, style } = props;
  if (!background && !iconContainerStyles) {
    return (
      <View style={style}>
        <Icon {...props} />
      </View>
    );
  } else if (iconContainerStyles && !background) {
    return (
      <View style={[iconContainerStyles, style]}>
        <Icon {...props} />
      </View>
    );
  } else if (
    content &&
    (background.length >= 1 || typeof background === "string")
  ) {
    if (content.uri) {
      return (
        <ImageBackground
          style={[styles.circle, style]}
          source={{ uri: content.uri }}
        />
      );
    } else {
      return (
        <LinearGradient
          colors={background}
          style={[styles.circle, props.style, style]}
        >
          <Text style={styles.text}>{content}</Text>
        </LinearGradient>
      );
    }
  } else if (background.length <= 1 || typeof background === "string") {
    return (
      <View
        colors={background}
        style={[styles.circle, { backgroundColor: background }, style]}
      >
        <Icon {...props} />
      </View>
    );
  }
  return (
    <LinearGradient
      colors={background}
      style={[styles.circle, props.style, style]}
    >
      <Icon {...props} />
    </LinearGradient>
  );
};

export default CircleIcons;
