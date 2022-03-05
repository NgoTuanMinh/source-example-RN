import React, { useState, useMemo, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text, withTheme } from "react-native-elements";
import Swipeable from "react-native-swipeable-row";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import CircleIcons from "../../Icons/CircleIcons";
import * as ImageCustom from "../../Icons/CircleIcons";
import {
  fixDecimals,
  convertTokensToCurrency,
} from "../../../halpers/utilities";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import { Image } from "react-native";

const ListItemTicketComponent = (props) => {
  const {
    theme,
    editTicket,
    item,
    tokens,
    conversionRate,
    numberTicket = 0,
    deleteTicket,
  } = props;

  let numberBuy = numberTicket;
  if (item.numberBuy) {
    numberBuy = item.numberBuy;
  }

  const onPressEdit = () => {
    editTicket && editTicket(item);
  };

  const onPressDelete = () => {
    deleteTicket && deleteTicket(item);
  };

  const ActionButtons = [
    <TouchableOpacity onPress={onPressEdit} style={styles.viewBtnStyle}>
      <LinearGradient
        style={styles.buttons}
        colors={theme.colors.primaryGradient}
      >
        <Image source={ImageCustom.icEditWhite} style={styles.iconEditStyle} />
        <Text style={styles.buttonText}>Edit</Text>
      </LinearGradient>
    </TouchableOpacity>,

    <TouchableOpacity style={styles.viewBtnStyle} onPress={onPressDelete}>
      <LinearGradient
        style={styles.buttons}
        colors={theme.colors.secondaryGradient}
      >
        <Image
          source={ImageCustom.icTrash}
          style={[
            styles.iconEditStyle,
            { height: 20, width: 18, resizeMode: "stretch" },
          ]}
        />
        <Text style={styles.buttonText}>Remove</Text>
      </LinearGradient>
    </TouchableOpacity>,
  ];

  return (
    <Swipeable rightButtons={ActionButtons}>
      <View style={styles.rowPriceStyle}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircleIcons
            name="logo-regular"
            color="#FF6195"
            size={{ width: 11, height: 12 }}
          />
          <Text
            style={[
              styles.txtTitleItemZero,
              { color: "#FF6195", fontWeight: "bold" },
            ]}
          >
            {" "}
            {fixDecimals(tokens)}{" "}
          </Text>

          <Text style={styles.txtTitleItemZero}>
            {" "}
            € {fixDecimals(convertTokensToCurrency(tokens, conversionRate))}
          </Text>
        </View>

        <View style={styles.rowStyle}>
          <Image source={ImageCustom.icTickets} style={styles.iconStyle} />
          <Text style={styles.txtNumberTicketStyle}>{numberBuy} left</Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default withNavigation(withTheme(ListItemTicketComponent));

const styles = StyleSheet.create({
  buttons: {
    width: 75,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    paddingTop: 5,
    color: "#fff",
    fontFamily: "Lato",
  },
  txtNumberTicketStyle: {
    color: "#000",
    marginLeft: 3,
    fontSize: 15,
    fontFamily: "Lato",
  },
  rowPriceStyle: {
    height: 70,
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    borderBottomWidth: 1,
  },
  txtTitleItemZero: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Lato",
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    width: 21,
    height: 17,
    resizeMode: "contain",
  },
  iconEditStyle: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  viewBtnStyle: {
    height: 70,
    width: 75,
  },
});
