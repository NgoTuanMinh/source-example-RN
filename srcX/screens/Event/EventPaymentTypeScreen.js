import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { connect } from "react-redux";
import { translate } from "../../../App";
import NavigationService from "../../NavigationService";
import EventPaymentTypeComponent from "../../components/Event/EventPaymentTypeComponent";
import {
  buyTicketOfficial,
  getWallet,
  buyMarketPlaceTicket,
  lockTickets,
} from "../../redux/actions/index";

const EventPaymentTypeScreen = (props) => {
  const { navigation, wallets, getWallet } = props;
  const dataTicket = navigation.state.params.dataTicket;
  const saleTickets = navigation.state.params.saleTickets;
  const event = navigation.state.params.itemEvent;
  const stopCountDown = navigation.state.params.stopCountDown;
  const feeMarket = navigation.state.params.feeMarketPlace;
  const tokenAmount = navigation.state.params.tokenAmount;
  const reservedOfficialTicketsIds =
    navigation.state.params.reservedOfficialTicketsIds;
  const reservedMarketPlaceTicketsIds =
    navigation.state.params.reservedMarketPlaceTicketsIds;

  const [typePay, setTypePay] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sumPrice, setSumPrice] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckPayment, setIsCheckPayment] = useState(false);
  const [isCheckSuccess, setIsCheckSuccess] = useState(false);
  const [isDisplayToast, setIsDisplayToast] = useState(true);

  useEffect(() => {
    calculateSum();
    setIsLoading(true);
    getWallet(onSuccess);
  }, []);

  useEffect(() => {
    if (tokenAmount) {
      //   showAlertTopUp(
      //     "Alert",
      //     "Top-up token will be taken some minutes. You need to wait for pay."
      //   );
      //setMainPrice(parseFloat(mainPrice + tokenAmount));
      //   console.log("thai token", tokenAmount);
      setIsCheckPayment(true);
      setIsLoading(true);
      //   getWallet(onSuccess);
      navigation.setParams({ ...navigation.state.params, tokenAmount: 0 });
    }
  }, [tokenAmount, mainPrice]);

  useEffect(() => {
    let currentWallet = wallets.dataWallet.filter(
      (item) => item.id == wallets.currentCardId
    );
    currentWallet = currentWallet[0];
    setMainPrice(parseFloat(currentWallet.mainPrice));
    if (isCheckSuccess == false) {
      getWallet(onSuccess);
    }
  }, [wallets]);

  const calculateSum = () => {
    let sumFee = 0;
    let sumPrice = sumFee;
    for (let i = 0; i < dataTicket.length; ++i) {
      sumPrice +=
        dataTicket[i].price * dataTicket[i].numberBuy * wallets.conversionRate;
    }

    for (let i = 0; i < saleTickets.length; ++i) {
      if (saleTickets[i]) {
        const marketPlacePrice = saleTickets[i].reduce((total, nextItem) => {
          return total + nextItem.numberBuy * nextItem.tokens;
        }, 0);
        sumPrice += marketPlacePrice;
        sumFee += marketPlacePrice * feeMarket;
      }
    }
    setSumPrice(sumPrice + sumFee);
  };

  const onChangeStatusToast = () => {
    setIsDisplayToast(false);
  };

  const onSuccess = () => {
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const onBackPress = () => {
    if (!isLoading) NavigationService.goBack();
  };

  const onNextSuccess = () => {
    setIsDisplayToast(true);
    const amount = Number(sumPrice.toFixed(2)) - mainPrice;
    if (amount > 0) {
      // console.log("thai1");
      NavigationService.navigate("TokenTopUpEvent", { amount });
      return;
    } else {
      setIsCheckPayment(!isCheckPayment);
      setIsCheckSuccess(true);
      NavigationService.navigate("LookerScreen", {
        submitToken: submitPayment,
      });
    }
  };

  const submitPayment = () => {
    try {
      setIsLoading(true);
      stopCountDown && stopCountDown();
      if (reservedOfficialTicketsIds && reservedOfficialTicketsIds.length > 0)
        buyTicketOfficial(
          reservedOfficialTicketsIds,
          buyOfficialTicketCallback
        );
      else buyOfficialTicketCallback({ success: true });
    } catch (error) {
      console.log("submitPayment error: ", error);
    }
  };

  const buyOfficialTicketCallback = (response) => {
    if (!response.success) {
      showAlert("Warning", response.data.Error);
      return;
    }
    if (
      reservedMarketPlaceTicketsIds &&
      reservedMarketPlaceTicketsIds.length > 0
    ) {
      buyMarketPlaceTicket(reservedMarketPlaceTicketsIds, onBuyTicketCallback);
    } else onBuyTicketCallback(response);
  };

  const onBuyTicketCallback = (response) => {
    setIsLoading(false);
    if (response.success) {
      NavigationService.navigate("BuyEventSuccessScreen", { event });
    } else {
      showAlert("Warning", response.data.Error);
    }
  };

  const showAlert = (title, content) => {
    Alert.alert(
      title,
      content,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.pop(3);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showAlertTopUp = (title, content) => {
    Alert.alert(title, content, [{ text: "OK", onPress: () => {} }], {
      cancelable: false,
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getWallet(onSuccess);
  };

  return (
    <EventPaymentTypeComponent
      onBackPress={onBackPress}
      onNextSuccess={onNextSuccess}
      typePay={typePay}
      setTypePay={setTypePay}
      arrayTickets={dataTicket}
      conversionRate={wallets.conversionRate}
      wallets={wallets}
      isLoading={isLoading}
      feeMarket={feeMarket}
      sumPrice={sumPrice}
      mainPrice={mainPrice}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      isCheckPayment={isCheckPayment}
      isDisplayToast={isDisplayToast}
      onChangeStatusToast={onChangeStatusToast}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

export default connect(
  mapStateToProps,
  { getWallet }
)(EventPaymentTypeScreen);
