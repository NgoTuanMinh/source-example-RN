import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import AppHeader from "../../components/HeaderComponent";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {} from "../../redux/actions/index";
import CircleIcons from "../../components/Icons/CircleIcons";
import { translate } from "../../../App";
import TopBarTiket from "./TopBarTiket";
import { focusMyTickets, focusBlurMyTickets } from "../../redux/actions/event";

const TicketTopScreen = (props) => {
  const { navigation, focusMyTickets, focusBlurMyTickets } = props;
  // console.log("thai 1", navigation.state);
  useEffect(() => {
    const didFocusSubscription = navigation.addListener(
      "didFocus",
      toggleFocus
    );
    const didBlurSubscription = navigation.addListener(
      "didBlur",
      toggleBlurFocus
    );

    return () => {
      didFocusSubscription.remove();
      didBlurSubscription.remove();
    };
  }, []);

  const toggleFocus = () => {
    focusMyTickets();
  };

  const toggleBlurFocus = () => {
    focusBlurMyTickets();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader title={"TICKET WALLET"} params={{ isNotification: true }}>
        <View style={styles.tabStyle}>
          <TopBarTiket />
        </View>
      </AppHeader>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    transactions: state.transactions,
  };
};

export default connect(
  mapStateToProps,
  { focusMyTickets, focusBlurMyTickets }
)(TicketTopScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabStyle: {
    flex: 1,
    marginTop: 10,
  },
});
