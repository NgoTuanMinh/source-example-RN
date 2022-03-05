import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import TicketDetailGrayComponent from "../../../components/Ticket/myTiket/TicketDetailGrayComponent";
import NavigationService from "../../../NavigationService";
import { getOwnTickets } from "../../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";

const TicketDetailGrayScreen = (props) => {
  const { navigation, wallets } = props;
  const item = props.navigation?.state?.params;

  const [dataTicket, setDataTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [currentTicketDefinition, setCurrentTicketDefinition] = useState(-1);
  const refQrCode = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    getCurrentHourFormat();
    getOwnTickets(item._id, callBackTicket);
  }, []);

  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const callBackTicket = (response) => {
    setIsLoading(false);
    if (response && response.length > 0) {
      setCurrentTicketDefinition(0);
      setDataTicket(response);
    }
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const onPressDetail = () => {
    NavigationService.navigate("EventDetailScreen", {
      eventId: item._id,
      isGay: true,
      //   item: item,
    });
  };

  const nextTransferScreen = () => {
    NavigationService.navigate("TransferTicketsScreen", {
      dataTicket,
      event: item,
    });
  };

  const nextSellTicket = () => {
    NavigationService.navigate("SellTicketStack", { dataTicket, event: item });
  };

  const onBeforeSnapChange = (index) => {
    setCurrentTicketDefinition(index);
    setTimeout(() => {
      refQrCode && refQrCode.current.snapToItem(0);
    }, 50);
  };

  return (
    <TicketDetailGrayComponent
      item={item}
      onBackPress={onBackPress}
      onPressDetail={onPressDetail}
      nextTransferScreen={nextTransferScreen}
      nextSellTicket={nextSellTicket}
      dataTicket={dataTicket}
      isLoading={isLoading}
      conversionRate={wallets.conversionRate}
      onBeforeSnapChange={onBeforeSnapChange}
      currentTicketDefinition={currentTicketDefinition}
      is24Hour={is24Hour}
      refQrCode={refQrCode}
    />
  );
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
)(TicketDetailGrayScreen);
