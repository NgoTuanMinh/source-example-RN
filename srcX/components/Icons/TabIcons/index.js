import React from "react";
import { Image, StyleSheet } from "react-native";
import Wallets from "./Wallets";
import Wearables from "./Wearables";
import Profile from "./Profile";
import Contacts from "./Contacts";
import Logo from "./Logo";
import * as ImageCustom from "../CircleIcons/index";

const TabNavIcon = ({ name, color }) => {
  switch (name) {
    case "Events":
      return (
        <Image
          source={ImageCustom.iconEvent}
          style={{
            height: 22,
            width: 19,
            tintColor: color,
            resizeMode: "contain",
          }}
        />
      );

    case "Wearables":
      return <Wearables color={color} />;

    case "Wallet":
      return <Wallets color={color} />;

    case "Tickets":
      return (
        <Image
          source={ImageCustom.icTickets}
          style={{
            height: 28,
            width: 23,
            tintColor: color,
            resizeMode: "contain",
          }}
        />
      );

    case "More":
      return (
        <Image
          source={ImageCustom.icDotHorizontal}
          style={{
            height: 5,
            width: 22,
            tintColor: color,
            resizeMode: "contain",
          }}
        />
      );

    case "Contacts":
      return <Contacts color={color} />;

    case "Logo":
      return <Logo color={color} />;

    default:
      return null;
  }
};

export default TabNavIcon;
