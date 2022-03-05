import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AppHeader from "../../components/HeaderComponent";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import CircleIcons from "../../components/Icons/CircleIcons";
import { translate } from "../../../App";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const CustomTopBarComponent = (props) => {
  const { titleTabOne, titleTabTwo, onScreenOne, onScreenTwo, event } = props;

  const focusFirtTab = props.navigationState.index == 0;

  const nextTabOne = () => {
    props.navigation.navigate(onScreenOne);
  };

  const nextTabTwo = () => {
    props.navigation.navigate(onScreenTwo);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={nextTabOne}
        style={focusFirtTab ? styles.showStyle : styles.hideStyle}
      >
        <Text style={focusFirtTab ? styles.txtShowStyle : styles.txtHideStyle}>
          {titleTabOne} ({event.numberMyTicket})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={nextTabTwo}
        style={!focusFirtTab ? styles.showStyle : styles.hideStyle}
      >
        <Text style={!focusFirtTab ? styles.txtShowStyle : styles.txtHideStyle}>
          {titleTabTwo} ({event.numeberSale})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: viewportWidth - 30,
    borderRadius: 48,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "#fff",

    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  showStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EA5284",
    height: 48,
    borderRadius: 48,
  },
  hideStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  txtShowStyle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  txtHideStyle: {
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

CustomTopBarComponent.defaultProps = {
  titleTabOne: "my tickets",
  titleTabTwo: "SELLING",
  onScreenOne: "MyTiketStack",
  onScreenTwo: "SaleTiketStack",
};
const mapStateToProps = (state) => {
  return {
    event: state.events,
  };
};

export default connect(mapStateToProps)(CustomTopBarComponent);
