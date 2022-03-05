import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform, BackHandler, Alert } from "react-native";
import TicketsForSaleComponent from "../../../components/Ticket/resellTickets/TicketsForSaleComponent";
import NavigationService from "../../../NavigationService";
import {
  focusMyTickets,
  requestUnsellTicket,
} from "../../../redux/actions/event";

const TicketsForSaleScreen = (props) => {
  const { navigation, wallets, focusMyTickets } = props;

  const dataSell = props.navigation?.state?.params.dataSell;
  const focusFirtTab = props.navigation?.state?.params.focusFirtTab;
  const event = props.navigation?.state?.params.event;

  const [currentTicket, setCurrentTicket] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);

  useEffect(() => {
    setIsShowToast(true);
    setTimeout(() => {
      setIsShowToast(false);
    }, 3000);
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const onBackPress = () => {
    focusMyTickets();
    // console.log("thai meo");
    NavigationService.navigate("TicketsStack");
  };

  const editTicket = (item) => {
    const saleType = focusFirtTab == 1 ? "PUBLIC" : "PRIVATE";
    if (item && item.tickets) {
      item.tickets.forEach((t) => {
        t.saleType = saleType;
      });
    }
    NavigationService.navigate("SaleDetailEditTikectScreen", { item, event });
  };

  const deleteTicket = (item) => {
    setIsLoading(true);
    requestUnsellTicket(item.tickets.map((s) => s.issuerId), onCallBackDelete);
  };

  const onPressSaleTiketScreen = () => {
    NavigationService.navigate("TicketsStack");
  };

  const onCallBackDelete = (response) => {
    setIsLoading(false);
    if (response.success) {
      // Alert.alert(
      //   "Alert",
      //   "Success!",
      //   [{ text: "OK", onPress: () => onPressSaleTiketScreen() }],
      //   { cancelable: true }
      // );
      //------
      // NavigationService.goBack();
      NavigationService.navigate("SaleStack", {
        event: event,
        statusToast: "Ticket listing deleted successfully",
      });
      // onPressSaleTiketScreen();
    }
  };

  const onPressSentTo = () => {
    let dataProps = dataSell;
    NavigationService.navigate("SentToTicketScreen", {
      dataProps,
      focusFirtTab,
      event,
    });
  };

  const onBeforeSnapChange = (index) => {
    setCurrentTicket(index);
  };

  return (
    <TicketsForSaleComponent
      onBackPress={onBackPress}
      editTicket={editTicket}
      onPressSentTo={onPressSentTo}
      currentTicket={currentTicket}
      conversionRate={wallets.conversionRate}
      onBeforeSnapChange={onBeforeSnapChange}
      focusFirtTab={focusFirtTab}
      event={event}
      dataSell={dataSell}
      isLoading={isLoading}
      deleteTicket={deleteTicket}
      isShowToast={isShowToast}
      setIsShowToast={setIsShowToast}
    />
  );
};

TicketsForSaleScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

const mapDispatchToProps = (dispatch) => ({
  //setCountryCode: payload => dispatch(setCountryCode(payload))
  focusMyTickets,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TicketsForSaleScreen);
