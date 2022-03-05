import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import theme from "../../../styles/themeStyles";
import * as ImageCustom from "../../Icons/CircleIcons/index";

const TransferTicketsSuccessComponent = ({ onBackPress }) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 50,
          }}
        >
          <Image source={ImageCustom.icSuccess} style={styles.icSuccess} />
          <Text style={styles.txtSuccessStyle}>Transfer Successful</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              marginTop: 15,
              color: "rgba(0, 0, 0, 0.4)",
              //   fontFamily: "Lato",
            }}
          >
            The receiver will be notified
          </Text>
        </View>

        <TouchableOpacity onPress={onBackPress}>
          <LinearGradient
            colors={["#FF6195", "#C2426C"]}
            style={styles.linearGradientNextStyle}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text style={styles.txtNumberTicketStyle}>Ticket wallet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state) => ({});

export default connect(
  mapStateToProps,
  () => ({})
)(TransferTicketsSuccessComponent);

const styles = StyleSheet.create({
  viewContainerStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
    paddingBottom: 30,
  },
  linearGradientNextStyle: {
    flexDirection: "row",
    width: "90%",
    // height: 55,
    paddingVertical: 20,
    alignSelf: "center",
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  txtNumberTicketStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 20,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: 15,
  },
  txtSuccessStyle: {
    fontSize: 24,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
  icSuccess: {
    width: 74,
    height: 74,
    resizeMode: "contain",
  },
});
