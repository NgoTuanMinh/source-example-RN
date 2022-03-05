import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform, Alert } from "react-native";
import SaleDetailEditTikectComponent from "../../../components/Ticket/saleTicket/SaleDetailEditTikectComponent";
import NavigationService from "../../../NavigationService";
import {
  getPriceRangeInEvent,
  editSellTickets,
  requestUnsellTicket,
  getOwnTickets,
} from "../../../redux/actions/index";
import { convertTokensToCurrency } from "../../../halpers/utilities";
import Snackbar from "react-native-snackbar";

const SaleDetailEditTikectScreen = (props) => {
  const { navigation, wallets } = props;
  const initPrice = {
    officialTokens: 0,
    officialPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    maxTokens: 0,
    minTokens: 0,
  };
  const item = props.navigation?.state?.params.item;
  const event = props.navigation?.state?.params.event;
  const currentEdit = item.tickets.length;

  const [isShowModal, setIsShowModal] = useState(false);
  const [itemBuy, setItemBuy] = useState({
    ...item,
    numberBuy: item.tickets.length,
    tokens: item.tickets.length > 0 ? item.tickets[0].tokens : 0,
  });
  const [currentPrice, setCurrentPrice] = useState(initPrice);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [notSaleTickets, setNotSaleTickets] = useState([]);

  useEffect(() => {
    getOwnTickets(event._id, callBackTicket);
    getPriceRangeInEvent(event._id, callBackgetPrice);
  }, []);

  const callBackgetPrice = (response) => {
    setIsLoading(false);
    if (
      response.success &&
      response.data.prices &&
      response.data.prices.length > 0
    ) {
      let priceModels = response.data.prices.filter((s) => s._id == item._id);
      if (priceModels.length <= 0) return;
      let priceModel = priceModels[0];
      const officialPrice = priceModel.officialPrice;
      const officialTokens = officialPrice * wallets.conversionRate;
      let maxTokens = officialTokens;
      let minTokens = officialTokens;

      if (priceModel.marketPlace && priceModel.marketPlace.minTokens) {
        maxTokens = priceModel.marketPlace.maxTokens;
        minTokens = priceModel.marketPlace.minTokens;
      }

      const maxPrice = convertTokensToCurrency(
        maxTokens,
        wallets.conversionRate
      );
      const minPrice = convertTokensToCurrency(
        minTokens,
        wallets.conversionRate
      );

      setCurrentPrice({
        officialTokens,
        officialPrice,
        minPrice,
        maxPrice,
        maxTokens,
        minTokens,
      });
    }
  };

  const callBackTicket = (response) => {
    const ticketDefinition = response.filter((s) => s._id == item._id);
    let numOfAvailableTickets = 0;
    if (ticketDefinition.length > 0) {
      setNotSaleTickets(ticketDefinition[0].tickets);
      numOfAvailableTickets = ticketDefinition[0].tickets.length;
    }
    setTotalTickets(numOfAvailableTickets + item.tickets.length);
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const onPressSaleTiketScreen = (content) => {
    // console.log("thai item", item);
    NavigationService.navigate("TicketsStack");
    NavigationService.navigate("SaleStack", {
      event: event,
      statusToast: content,
    });
  };

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onCallBackPrice = (txt) => {
    onToggleModal();
    if (txt) {
      setItemBuy({ ...itemBuy, tokens: txt });
    }
  };

  const onPluss = () => {
    setItemBuy({ ...itemBuy, numberBuy: itemBuy.numberBuy + 1 });
  };

  const onMinus = () => {
    setItemBuy({ ...itemBuy, numberBuy: itemBuy.numberBuy - 1 });
  };

  const onPressSave = () => {
    let tickets = [];
    if (currentEdit > itemBuy.numberBuy) {
      const numberOfUnsellTicket = currentEdit - itemBuy.numberBuy;
      tickets.push(...itemBuy.tickets.slice(numberOfUnsellTicket));
    } else {
      const numberOfSellTicket = itemBuy.numberBuy - currentEdit;
      tickets.push(...item.tickets);
      if (notSaleTickets.length >= numberOfSellTicket) {
        tickets.push(...notSaleTickets.slice(0, numberOfSellTicket));
      }
    }

    if (tickets.length > 0) {
      tickets.forEach((t) => {
        t.tokens = itemBuy.tokens;
      });
      setIsLoading(true);
      editSellTickets(tickets, onCallBackSave);
    } else {
      onCallBackSave({ success: true });
    }
  };

  const unSellTickets = () => {
    let ticketsForUnSell = [];
    if (currentEdit > itemBuy.numberBuy) {
      const numberOfUnsellTicket = currentEdit - itemBuy.numberBuy;
      ticketsForUnSell.push(...itemBuy.tickets.slice(0, numberOfUnsellTicket));
    }

    if (ticketsForUnSell && ticketsForUnSell.length > 0) {
      setIsLoading(true);
      requestUnsellTicket(
        ticketsForUnSell.map((s) => s.issuerId),
        onCallBackUnsell
      );
    } else {
      onCallBackUnsell({ success: true });
    }
  };

  const onCallBackSave = (response) => {
    if (response.success) {
      unSellTickets();
    } else {
      // Alert.alert(
      //   "Alert",
      //   "Edit resell ticket Failed!",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => onPressSaleTiketScreen("Edit resell ticket Failed!"),
      //     },
      //   ],
      //   { cancelable: true }
      // );
      onPressSaleTiketScreen("Edit resell ticket Failed!");
    }
  };

  const onCallBackUnsell = (response) => {
    setIsLoading(false);
    if (response.success) {
      // Alert.alert(
      //   "Alert",
      //   "Success!",
      //   [
      //     {
      //       text: "OK",
      //       onPress: () =>
      //         onPressSaleTiketScreen("Ticket listing edited successfully."),
      //     },
      //   ],
      //   { cancelable: true }
      // );
      onPressSaleTiketScreen("Ticket listing edited successfully.");
    }
  };

  return (
    <SaleDetailEditTikectComponent
      onBackPress={onBackPress}
      isShowModal={isShowModal}
      onToggleModal={onToggleModal}
      onCallBackPrice={onCallBackPrice}
      item={itemBuy}
      event={event}
      onPluss={onPluss}
      onMinus={onMinus}
      conversionRate={wallets.conversionRate}
      currentPrice={currentPrice}
      onPressSave={onPressSave}
      isLoading={isLoading}
      totalTickets={totalTickets}
    />
  );
};

SaleDetailEditTikectScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

const mapDispatchToProps = (dispatch) => ({
  //setCountryCode: payload => dispatch(setCountryCode(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleDetailEditTikectScreen);
