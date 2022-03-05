import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import ResellTicketsComponent from "../../../components/Ticket/resellTickets/ResellTicketsComponent";
import NavigationService from "../../../NavigationService";
import {
  getPriceRangeInEvent,
  sellTicket,
  getOwnTickets,
  getAvailableTickets,
} from "../../../redux/actions/index";
import { convertTokensToCurrency } from "../../../halpers/utilities";

const initPrice = [
  {
    marketPlace: [{ minTokens: 0, maxTokens: 0 }],
    officialPrice: 0,
  },
];
const ResellTicketsScreen = (props) => {
  const { navigation, wallets, profile, user } = props;

  let dataTicket = props.navigation?.state?.params.dataTicket;
  const event = props.navigation?.state?.params.event;
  const currentTicketDefinition =
    props.navigation?.state?.params.currentTicketDefinition ?? -1;
  const idCurrentTicket = props.navigation?.state?.params.idCurrentTicket ?? "";
  const ticketIds = dataTicket
    ? dataTicket
        .map((s) => s.tickets)
        .flat()
        .map((s) => s?._id)
    : [];
  const [isShowModal, setIsShowModal] = useState(false);
  const refCarousel = useRef(null);
  const refTicketView = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentTicket, setCurrentTicket] = useState(0);
  const [dataSell, setDataSell] = useState(null);
  const [focusFirtTab, setFocusFirtTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(initPrice);

  useEffect(() => {
    setIsLoading(true);
    if (dataTicket) {
      //returnDataSell();
      getAvailableTickets(ticketIds, onAvailableTicketsCallback);
    } else {
      getOwnTickets(event._id, callBackTicket);
    }
  }, []);

  const onAvailableTicketsCallback = (response) => {
    let availableTicketIds = ticketIds;
    if (response.success) {
      availableTicketIds = response.data.map((s) => s._id);
    }
    for (let i = 0; i < dataTicket.length; ++i) {
      // ignore all tickets is checked-in
      dataTicket[i].tickets = dataTicket[i].tickets.filter((s) =>
        availableTicketIds.includes(s._id)
      );
    }
    returnDataSell();
    getPriceRangeInEvent(event._id, callBackPrice);
  };

  const callBackTicket = (response) => {
    if (response && response.length > 0) {
      // get ticket with no checked-in

      for (let i = 0; i < response.length; i++) {
        if (response[i].tickets)
          response[i].tickets = response[i].tickets.filter(
            (s) => !s.status || s.status === "NONE"
          );
      }
      dataTicket = response;
      returnDataSell();
    }
    getPriceRangeInEvent(event._id, callBackPrice);
  };
  const returnDataSell = () => {
    // console.log("dataaaaaaa", dataTicket);
    var currentIndex = 0;
    let dataSell = [];
    for (let i = 0; i < dataTicket.length; ++i) {
      let item = { ...dataTicket[i], numberBuy: 0 };
      // convert price to token
      item.tokens = item.price * wallets.conversionRate;
      dataSell.push(item);
      if (dataTicket[i]._id == idCurrentTicket) {
        currentIndex = i;
      }
    }
    if (currentTicketDefinition >= 0) {
      if (
        dataSell[currentTicketDefinition].tickets &&
        dataSell[currentTicketDefinition].tickets.length > 0
      ) {
        dataSell[currentTicketDefinition].numberBuy = 1;
      }
      setTimeout(() => {
        refTicketView.current && refTicketView.current.snapToItem(currentIndex);
      }, 500);
    }
    setDataSell(dataSell);
  };

  const callBackPrice = (response) => {
    setIsLoading(false);
    // console.log("thai data ticket", dataTicket);
    let data = [];
    // console.log("dataTicket=====", dataTicket);
    dataTicket.forEach((s) => {
      response.data.prices.forEach((r) => {
        if (s._id === r._id) data.push(r);
      });
    });

    // console.log("Data price", data);
    setCurrentPrice(data);
  };

  const onBackPress = () => {
    if (!isLoading) NavigationService.goBack();
  };

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onCallBackPrice = (txt) => {
    if (txt) {
      let newData = dataSell.slice();
      newData[currentTicket].tokens = txt;
      newData[currentTicket].price = convertTokensToCurrency(
        newData[currentTicket].tokens,
        wallets.conversionRate
      );
      setDataSell(newData);
    }
    onToggleModal();
  };

  const nextActiveSlide = () => {
    refCarousel.current.snapToNext();
    setActiveSlide(activeSlide + 1);
  };

  const onSwipeLeft = () => {
    refCarousel.current.snapToPrev();
    setActiveSlide(0);
  };

  const getUserName = () => {
    let customeUser = {
      ...user,
      ...profile,
    };
    if (!customeUser) return "";
    let firstName = "";
    if (customeUser.firstName) {
      firstName = customeUser.firstName;
    }
    let lastName = "";
    if (customeUser.lastName) {
      lastName = customeUser.lastName;
    }
    return firstName + ", " + lastName;
  };

  const onNextTicketsForSale = () => {
    let tickets = [];
    for (let i = 0; i < dataSell.length; ++i) {
      if (dataSell[i].numberBuy > 0) {
        for (let j = 0; j < dataSell[i].numberBuy; j++) {
          let item = {
            issuerId: dataSell[i].tickets[j].issuerId,
            tokens: dataSell[i].tokens,
          };
          tickets.push(item);
        }
      }
    }
    setIsLoading(true);
    sellTicket(
      tickets,
      focusFirtTab == 1 ? "PUBLIC" : "PRIVATE",
      onCalbackSellTicket
    );
  };

  const onCalbackSellTicket = (response) => {
    setIsLoading(false);
    if (response.success) {
      // update datasell
      const tickets = [];
      for (let i = 0; i < dataSell.length; ++i) {
        if (dataSell[i].numberBuy > 0) {
          dataSell[i].tickets = dataSell[i].tickets.slice(
            0,
            dataSell[i].numberBuy
          );
          dataSell[i].tickets.forEach((s) => {
            s.tokens = dataSell[i].tokens;
          });
          tickets.push(dataSell[i]);
        }
      }

      // console.log("dataSell", dataSell);
      NavigationService.navigate("TicketsForSaleScreen", {
        dataSell: tickets,
        focusFirtTab,
        event,
      });
    }
  };

  const onPressPlus = () => {
    let newData = dataSell.slice();
    ++newData[currentTicket].numberBuy;
    setDataSell(newData);
  };

  const onPressMinus = () => {
    let newData = dataSell.slice();
    --newData[currentTicket].numberBuy;
    if (newData[currentTicket].numberBuy < 0)
      newData[currentTicket].numberBuy = 0;
    setDataSell(newData);
  };

  const onBeforeSnapChange = (index) => {
    setCurrentTicket(index);
  };

  const nextTabTwo = () => {
    setFocusFirtTab(2);
  };

  const nextTabOne = () => {
    setFocusFirtTab(1);
  };

  return (
    <ResellTicketsComponent
      onBackPress={onBackPress}
      isShowModal={isShowModal}
      onToggleModal={onToggleModal}
      onCallBackPrice={onCallBackPrice}
      refCarousel={refCarousel}
      refTicketView={refTicketView}
      activeSlide={activeSlide}
      setActiveSlide={setActiveSlide}
      nextActiveSlide={nextActiveSlide}
      onSwipeLeft={onSwipeLeft}
      onNextTicketsForSale={onNextTicketsForSale}
      conversionRate={wallets.conversionRate}
      dataSell={dataSell}
      currentTicket={currentTicket}
      onPressPlus={onPressPlus}
      onPressMinus={onPressMinus}
      onBeforeSnapChange={onBeforeSnapChange}
      focusFirtTab={focusFirtTab}
      nextTabTwo={nextTabTwo}
      nextTabOne={nextTabOne}
      isLoading={isLoading}
      currentPrice={currentPrice}
      event={event}
    />
  );
};

ResellTicketsScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    profile: state.profile.uploadResponse,
    user: state.registration.screenName,
  };
};

const mapDispatchToProps = (dispatch) => ({
  //setCountryCode: payload => dispatch(setCountryCode(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResellTicketsScreen);
