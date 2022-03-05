import React, { useState, useEffect, useCallback } from "react";
import { ScrollView } from "react-native";
import { connect } from "react-redux";
import { translate } from "../../../App";
import { useFocusEffect } from "@react-navigation/native";
import NavigationService from "../../NavigationService";
import EventBuyComponent from "../../components/Event/EventBuyComponent";
import {
  getEventTicketDefinitions,
  getEventSellTickets,
  getTotalOwnTickets,
} from "../../redux/actions/index";
import { getDataKeystore, storeKey } from "../../redux/actions/keyStore";

const EventBuyScreen = (props) => {
  const { navigation, wallets } = props;
  const itemEvent = navigation.state.params.itemEvent;

  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [officialTickets, setOfficialTickets] = useState([]);
  const [marketPlaceTickets, setMarketPlaceTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(-1);
  const [sumTicketSell, setSumTicketSell] = useState(0);
  const [sumSalesTicket, setSumSalesTicket] = useState(0);
  const [userId, setUserId] = useState(null);
  const [idTicket, setIdTicket] = useState("");
  let officialTicketsTemp = [];

  useEffect(() => {
    setIsLoading(true);
    getUserId();
    getEventTicketDefinitions(itemEvent._id, constructOfficialTickets);
    getTotalOwnTickets(itemEvent._id, callBackSumTicketSell);
    // console.log("thai item", itemEvent);
  }, []);

  const getUserId = async () => {
    const userId = await getDataKeystore("@userId");
    setUserId(userId);
  };

  const callBackSumTicketSell = (response) => {
    if (response && response.success) {
      setSumTicketSell(response.data);
    }
  };

  const constructOfficialTickets = (response) => {
    // console.log("response", response);
    officialTicketsTemp = [];
    if (response.data && response.data.length > 0) {
      let data = response.data;
      data = data.map((item) => {
        const existItem = officialTickets.filter((s) => s._id == item._id);
        let numberBuy =
          existItem && existItem.length ? existItem[0].numberBuy : 0;
        // just can buy maximum item
        if (item.numOfLefTickets < numberBuy) numberBuy = item.numOfLefTickets;
        return {
          ...item,
          numberBuy,
        };
      });

      setOfficialTickets(data);
      officialTicketsTemp.push(...data);
      if (currentTicket < 0) {
        setCurrentTicket(0);
        // console.log("tppppppp", officialTicketsTemp[0]._id);
        setIdTicket(officialTicketsTemp[0]._id);
      }
      // get detail
      getEventSellTickets(itemEvent._id, callBackUserSell);
    } else {
      setIsLoading(false);
    }
  };

  const callBackUserSell = (response) => {
    if (response.data && response.data.length > 0) {
      const tempMarketPlaceTickets = [];
      officialTicketsTemp.forEach((s) => {
        let mapTickets = {};
        const tickets = response.data
          .filter((sellTicket) => sellTicket.ticketDefinition == s._id)
          .map((s) => s);

        // group by sellerName and tokens
        tickets.forEach((s) => {
          const key = s.ticketDefinition + s.tokens + s.seller;
          const existItem = marketPlaceTickets
            .flat()
            .filter((i) => i.ticketDefinition + i.tokens + i.seller == key);
          let item = mapTickets[key] ?? {
            ...s,
            numberBuy:
              existItem && existItem.length ? existItem[0].numberBuy : 0,
            tickets: [],
          };
          item.tickets.push(s.issuerId);
          mapTickets[key] = item;
        });

        tempMarketPlaceTickets.push(
          Object.entries(mapTickets).map(([key, value]) => {
            if (value.numberBuy > value.tickets.length) value.numberBuy = 0;
            return value;
          })
        );
      });
      setMarketPlaceTickets(tempMarketPlaceTickets);

      setSumSalesTicket(response.data.length);
    }
    setIsLoading(false);
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const toggleShowDetail = useCallback(() => {
    setIsShowDetail(!isShowDetail);
  }, [isShowDetail]);

  const nextCheckoutScreen = () => {
    let dataTicket = [];

    const saleTickets = [];
    for (let i = 0; i < officialTickets.length; ++i) {
      dataTicket.push(officialTickets[i]);
      if (marketPlaceTickets[i])
        saleTickets.push(marketPlaceTickets[i].filter((s) => s.numberBuy > 0));
    }

    NavigationService.navigate("CheckoutScreen", {
      dataTicket,
      itemEvent,
      saleTickets,
      onGoBack,
    });
  };

  const onGoBack = () => {
    setIsLoading(true);
    getEventTicketDefinitions(itemEvent._id, constructOfficialTickets);
  };

  const onNextSellScreen = () => {
    NavigationService.navigate("SellTicketStack", {
      event: itemEvent,
      currentTicketDefinition: currentTicket,
      idCurrentTicket: idTicket,
    });
  };

  const plusEvent = useCallback(() => {
    if (!checkIfUserBuyMaximumTicket()) {
      let data = officialTickets.slice();
      data[currentTicket].numberBuy = data[currentTicket].numberBuy + 1;
      setOfficialTickets(data);
    }
  }, [currentTicket, officialTickets]);

  const minusEvent = useCallback(() => {
    let data = officialTickets.slice();
    data[currentTicket].numberBuy = data[currentTicket].numberBuy - 1;
    setOfficialTickets(data);
  }, [currentTicket, officialTickets]);

  const onBeforeSnapChange = (index) => {
    // console.log("cccc", index);
    // console.log("tkkkkkk", officialTickets[index]._id);
    setIdTicket(officialTickets[index]._id);
    setCurrentTicket(index);
  };

  const checkIfUserBuyMaximumTicket = () => {
    let totalTicket = 0;
    if (officialTickets && officialTickets[currentTicket])
      totalTicket += officialTickets[currentTicket].numberBuy;
    if (marketPlaceTickets && marketPlaceTickets[currentTicket])
      totalTicket += marketPlaceTickets[currentTicket].reduce((total, s) => {
        return total + s.numberBuy;
      }, 0);

    if (
      officialTickets[currentTicket].maxReservable &&
      totalTicket >= officialTickets[currentTicket].maxReservable
    ) {
      alert(
        `You can purchase max ${
          officialTickets[currentTicket].maxReservable
        } ticket(s).`
      );
      return true;
    }
    return false;
  };

  const onPressPlusUser = (item, index) => {
    if (!checkIfUserBuyMaximumTicket()) {
      let data = marketPlaceTickets.slice();
      data[currentTicket][index].numberBuy =
        data[currentTicket][index].numberBuy + 1;
      setMarketPlaceTickets(data);
    }
  };

  const onPressMinusUser = (item, index) => {
    let data = marketPlaceTickets.slice();
    data[currentTicket][index].numberBuy =
      data[currentTicket][index].numberBuy - 1;
    if (data[currentTicket][index].numberBuy < 0)
      data[currentTicket][index].numberBuy = 0;
    setMarketPlaceTickets(data);
  };

  return (
    <EventBuyComponent
      onBackPress={onBackPress}
      isShowDetail={isShowDetail}
      toggleShowDetail={toggleShowDetail}
      nextCheckoutScreen={nextCheckoutScreen}
      onNextSellScreen={onNextSellScreen}
      isLoading={isLoading}
      itemEvent={itemEvent}
      plusEvent={plusEvent}
      minusEvent={minusEvent}
      conversionRate={wallets.conversionRate}
      marketPlaceTickets={marketPlaceTickets}
      officialTickets={officialTickets}
      currentTicket={currentTicket}
      onBeforeSnapChange={onBeforeSnapChange}
      sumTicketSell={sumTicketSell}
      onPressMinusUser={onPressMinusUser}
      onPressPlusUser={onPressPlusUser}
      userId={userId}
      sumSalesTicket={sumSalesTicket}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

export default connect(mapStateToProps)(EventBuyScreen);
