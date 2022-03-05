import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { withTheme, Icon } from "react-native-elements";
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from "react-native-linear-gradient";
import NavigationService from "../../NavigationService";
import * as Images from "../Icons/CircleIcons";
import { connect } from "react-redux";
import { autoAcceptTransferTicket } from "../../redux/actions";

const styles = StyleSheet.create({
  iconStyle: {
    width: 16,
    height: 20,
    resizeMode: "contain",
  },
  numberContainer: {
    position: "absolute",
    right: -5,
    top: 0,
    minHeight: 14,
    minWidth: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  btnNotify: { paddingVertical: 10, paddingLeft: 10 },
  textNumberNotify: {
    color: "#fff",
    fontSize: 13,
  },
});

const HeaderRightComponent = ({ theme, params, notifi }) => {
  const count = notifi.numUnread ? notifi.numUnread : 0;
  let countStr = count > 99 ? `${count}+` : `${count}`;

  const onPressNotifi = () => {
    //NavigationService.navigate("NotificationNavigator");
    autoAcceptTransferTicket();
    NavigationService.navigate("NotiStack");
  };

  return (
    <TouchableOpacity onPress={onPressNotifi} style={styles.btnNotify}>
      <Image source={Images.icNotify} style={styles.iconStyle} />

      {count ? (
        <LinearGradient
          colors={["#FF6195", "#C2426C"]}
          style={styles.numberContainer}
        >
          <Text style={styles.textNumberNotify}>{countStr}</Text>
        </LinearGradient>
      ) : null}
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => {
  return {
    notifi: state.notifications,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withTheme(HeaderRightComponent));
