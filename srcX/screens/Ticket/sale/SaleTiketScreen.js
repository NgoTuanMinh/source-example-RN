import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import SaleTiketComponent from "../../../components/Ticket/saleTicket/SaleTiketComponent";
import NavigationService from "../../../NavigationService";
import {
  getListSaleTicket,
  setNumberSaleTickets,
} from "../../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";

const SaleTiketScreen = (props) => {
  const { navigation, setNumberSaleTickets, events } = props;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getCurrentHourFormat();
  }, []);

  useEffect(() => {
    getData();
  }, [events.focusMyTickets]);

  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    getListSaleTicket(getSaleCallBack);
  };

  const getSaleCallBack = (response) => {
    setIsLoading(false);
    setIsRefreshing(false);
    if (response) {
      let data = response;
      setData(data);
      let numberMyTicket = 0;
      for (let i = 0; i < data.length; ++i) {
        numberMyTicket += data[i].totalTickets;
      }
      setNumberSaleTickets(numberMyTicket);
    }
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getData();
  };

  const nextSaleScreen = (item) => {
    NavigationService.navigate("SaleStack", item);
  };

  return (
    <SaleTiketComponent
      data={data}
      onBackPress={onBackPress}
      nextSaleScreen={nextSaleScreen}
      onRefresh={onRefresh}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      is24Hour={is24Hour}
    />
  );
};

SaleTiketScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    events: state.events,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setNumberSaleTickets: (payload) => dispatch(setNumberSaleTickets(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleTiketScreen);
