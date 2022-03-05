import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, AppState, Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { translate } from '../../../App';
import NavigationService from '../../NavigationService';
import CheckoutComponent from '../../components/Event/CheckoutComponent'
import { storeKey, getDataKeystore } from '../../redux/actions/keyStore';
import {
  getFeeMarket,
  lockTickets,
  unlockTickets, 
  addLockedTicketIds
} from "../../redux/actions/index";

import { makePluralityText } from '../../halpers/utilities';

const CheckoutScreen = props => {
  const { navigation, wallets } = props;
  const dataTicket = navigation.state.params.dataTicket;
  const saleTickets = navigation.state.params.saleTickets;
  const itemEvent = navigation.state.params.itemEvent;

  const [countDown, setCountDown] = useState(-1);
  const [isFocus, setIsFocus] = useState(true);
  const [feeMarket, setFeeMarket] = useState(0.05);
  const [isLoading, setIsLoading] = useState(false);
  const [arrayTickets, setArrayTickets] = useState(dataTicket);
  const [marketPlaceTickets, setMarketPlaceTickets] = useState(saleTickets);

  let clearInter = useRef(null)
  let currentTime = 0;
  useEffect(() => {
    loadStep(1);
  }, []);

  const callBackGetFee = useCallback((response) => {
    if (response.success) {
      let fee_market = (parseInt(response.feeRate)) / 100;

      setFeeMarket(fee_market)
    }
    loadStep(2);
  },[]);

  const lockOfficialTickets = () => {
    const ticketInfoList = [];
    for (let i = 0; i < dataTicket.length; ++i) {
        if (dataTicket[i].numberBuy != 0) {
            let item = {
                amount: dataTicket[i].numberBuy,
                ticketDefinitionId: dataTicket[i]._id
            }
            ticketInfoList.push(item);
        }
    }
    lockTickets(ticketInfoList, onOfficialLockedTicket);
  }  

  const lockMarketPlaceTicket = () => {
      const ticketInfoList = [];
      for (let i = 0; i < saleTickets.length; i++) {
          for (let j = 0; j < saleTickets[i].length; j++){
            if (saleTickets[i][j].numberBuy == 0) continue;
            let item = {
                amount: saleTickets[i][j].numberBuy,
                ticketDefinitionId: saleTickets[i][j].ticketDefinitionId,
                tokens: saleTickets[i][j].tokens,
                seller: saleTickets[i][j].seller
            }
            ticketInfoList.push(item);
          }
      }
      lockTickets(ticketInfoList, onMarketPlaceLockedTickets);
  }

  const loadStep = (step) => {
      switch (step){
          case 1: 
            setIsLoading(true);
            getFeeMarket(callBackGetFee);
          break;
          case 2:
              lockOfficialTickets();
          break;
          case 3: 
              lockMarketPlaceTicket();
          break;
          default: 
              setIsLoading(false);
              let totalReservedTickets = 0; 
              let totalTickets = 0;
              if (dataTicket && dataTicket.totalReservedTickets) {
                totalReservedTickets += dataTicket.totalReservedTickets;
              }
              if (dataTicket && dataTicket.totalTickets) {
                totalTickets += dataTicket.totalTickets;
              } 

              if (saleTickets && saleTickets.totalReservedTickets) {
                totalReservedTickets += saleTickets.totalReservedTickets;
              }
              if (saleTickets && saleTickets.totalTickets) {
                totalTickets += saleTickets.totalTickets;
              } 

              if (totalReservedTickets == 0) {
                showAlert("Warning", 'ticket is sold out', onBackPress);
              }else {
                if (totalTickets > totalReservedTickets) {
                  showAlert("Warning", `only ${makePluralityText(totalReservedTickets, "tickets", "1 ticket")} available`);
                }
                startTimer(600);
              }
              break;
      } 
  }

  const onLockTickes = (response, funcUpdate, nextStep) => {
    if (response.success) {
        if (response.data) {
            if (response.data.length > 0) {
              funcUpdate(response.data);
            }else {
                showAlert("Warning", translate('TicketNotAvailable'));
                nextStep++;
            }
        }
        loadStep(nextStep);
    }else {
        showAlert("Warning", response.data.Error);
    }
  }

  const showAlert = (title, content, okPress) => {
    Alert.alert(
        title,
        content,
        [
            {
                text: "OK", onPress: () => {
                   if (okPress)
                    okPress();
                }
            }
        ],
        { cancelable: false }
    );
}

  const onOfficialLockedTicket = (response) => {
    onLockTickes(response, updateOfficialTicket, 3);
  }

  const updateOfficialTicket = async (lockedTickets) => {
    dataTicket.totalTickets = 0;
    dataTicket.totalReservedTickets = 0;
    dataTicket.ticketIds = [];
    for (let i = 0; i < dataTicket.length; i++) {
      const lockedItems = lockedTickets.filter(s => s.ticketDefinitionId == dataTicket[i]._id);
      const reservedTickets = lockedItems.map(s => s.reserved).flat();
      dataTicket.ticketIds.push(...reservedTickets);
      dataTicket.totalTickets += dataTicket[i].numberBuy;
      dataTicket.totalReservedTickets += reservedTickets.length;
      dataTicket[i].numberBuy = reservedTickets.length;
    }

    // save to memory to unlock
    let ticketIds = dataTicket.ticketIds || [];
    if (ticketIds.length > 0) {
      addLockedTicketIds(ticketIds);
    }


    setArrayTickets(dataTicket.slice());
  }

  const onMarketPlaceLockedTickets = (response) => {
    onLockTickes(response, updateMarketPlaceTicket, 4);
  }

  const updateMarketPlaceTicket = (lockedTickets) => {
    saleTickets.totalTickets = 0;
    saleTickets.totalReservedTickets = 0;
    saleTickets.ticketIds = [];

    for (let i = 0; i < saleTickets.length; i++) {
      for (let j = 0; j < saleTickets[i].length; j++){
        const lockedItems = lockedTickets.filter(s =>
          s.ticketDefinitionId == saleTickets[i][j].ticketDefinitionId &&
          s.amount == saleTickets[i][j].numberBuy &&
          s.tokens == saleTickets[i][j].tokens &&
          s.seller == saleTickets[i][j].seller);
        const reservedTickets = lockedItems.map(s => s.reserved).flat();
        saleTickets.ticketIds.push(...reservedTickets);
        saleTickets.totalTickets += saleTickets[i][j].numberBuy;
        saleTickets.totalReservedTickets += reservedTickets.length;
        saleTickets[i][j].numberBuy = reservedTickets.length;
      }
    }

    // save to memory to unlock
    let ticketIds = saleTickets.ticketIds || [];
    if (ticketIds.length > 0) {
      addLockedTicketIds(ticketIds);
    }
    setMarketPlaceTickets(saleTickets.slice());
  }
  

  useEffect(() => {
    AppState.addEventListener("change", checkStatusApp);
    return () => {
      AppState.removeEventListener("change", checkStatusApp);
    }
  }, [countDown]);

  const checkStatusApp = (nextAppState) => {
    if (nextAppState == "inactive") {
      currentTime = 0;
      return;
    }
    if (nextAppState == "background" && currentTime == 0) {
      unlockTickets();
      if (Platform.OS == "android") {
        clearInterval(clearInter);
        currentTime = new Date().getTime() / 1000;
      }
      return;
    }
    if (nextAppState == 'active' && currentTime != 0) {
      checkShowFaceId();
    }
  }

  const checkShowFaceId = async () => {
    let timestamp = (new Date().getTime() / 1000) - currentTime;
    if (Platform.OS == "android") {
      timestamp = Math.floor(timestamp);
      setCountDown((countDown) => countDown - timestamp)
    }
    currentTime = 0;
  }

  const startTimer = (timer) => {
    setCountDown(timer);
    clearInter = setInterval(() => {
      updateTimer();
    }, 1000);
  };

  const updateTimer = () => {
    setCountDown((countDown) => countDown - 1);
  }

  const clearTimer = () => {
    if (clearInter)
      clearInterval(clearInter);
    clearInter = null;
  }

  useEffect(() => {
    if (countDown == 0) {
      clearTimer();
      Alert.alert(
        "Ticket reservation time expired",
        "Please select your ticket(s) again to purchase.",
        [
          {
            text: "OK", onPress: () => {
              onBackPress();
            }
          }
        ],
        { cancelable: false }
      );
    }
   
  }, [countDown]);

  useEffect(() => {
    return () => {
      clearTimer();
    }
  })

  useEffect(() => {
    const didFocusSubscription = navigation.addListener('didFocus', toggleFocus);
    const didBlurSubscription = navigation.addListener('didBlur', toggleBlurFocus);

    return () => {
      didFocusSubscription.remove();
      didBlurSubscription.remove();
    };
  }, []);

  const toggleFocus = () => {
    setIsFocus(true);
  }

  const toggleBlurFocus = () => {
    setIsFocus(false);
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [])

  const onBackPress = async () => {
    NavigationService.goBack();
    // call go back here
    await unlockTickets();
    if (navigation.state.params.onGoBack)
      navigation.state.params.onGoBack();
    return true;
  }

  const stopCountDown = () => {
    setCountDown(-1);
    clearTimer();
  }

  const onNextPayment = () => {
    let feeMarketPlace = feeMarket;
    let reservedOfficialTicketsIds = dataTicket.ticketIds;
    let reservedMarketPlaceTicketsIds = saleTickets.ticketIds;
    NavigationService.navigate("EventPaymentTypeScreen", { dataTicket, itemEvent, stopCountDown, feeMarketPlace, saleTickets, reservedMarketPlaceTicketsIds, reservedOfficialTicketsIds });
  }

  return (
    <CheckoutComponent
      onBackPress={onBackPress}
      onNextPayment={onNextPayment}
      countDown={countDown}
      arrayTickets={arrayTickets}
      saleTickets = {marketPlaceTickets}
      isLoading={isLoading}
      conversionRate={wallets.conversionRate}
      itemEvent={itemEvent}
      feeMarket={feeMarket}
    />
  )
}
const mapStateToProps = state => {
  return {
    wallets: state.wallets,
  }
};

export default connect(mapStateToProps)(CheckoutScreen);