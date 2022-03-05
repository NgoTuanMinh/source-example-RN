import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform, Alert } from "react-native";
import TiketComponent from "../../../components/Ticket/myTiket/TiketComponent";
import NavigationService from "../../../NavigationService";
import { getOwnTickets } from "../../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import { getQrCode } from "../../../redux/actions/event";
import { getDataKeystore, storeKey } from "../../../redux/actions/keyStore";

const TiketScreen = (props) => {
  const { navigation, wallets } = props;
  const item = props.navigation?.state?.params;

  // console.log("thai e", wallets);

  const [dataTicket, setDataTicket] = useState(null);
  const [currentTicketDefinition, setCurrentTicketDefinition] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const refQrCode = useRef(null);
  const selectedItem = {};
  const [isShowButton, setIsShowButton] = useState(true);
  const [dateFormat, setDateFormat] = useState("DD MMMM");

  useEffect(() => {
    handleGetDateFormat();
    setIsLoading(true);
    getCurrentHourFormat();
    getOwnTickets(item._id, callBackTicket);
  }, []);

  const handleGetDateFormat = async () => {
    const formatDate = await getDataKeystore("@locale");
    if (formatDate) {
      setDateFormat(formatDate);
    }
  };
  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const callBackTicket = (response) => {
    // console.log("thai 1", response);
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
      // item: item,
    });
  };

  const nextTransferScreen = () => {
    NavigationService.navigate("TransferTicketsScreen", {
      dataTicket,
      event: item,
    });
  };

  const nextSellTicket = () => {
    // console.log("dataaaaa", dataTicket);
    NavigationService.navigate("SellTicketStack", {
      dataTicket,
      event: item,
      currentTicketDefinition,
    });
  };

  const onBeforeSnapChange = (index) => {
    // console.log(dataTicket);
    // console.log("new data", dataTicket);
    setCurrentTicketDefinition(index);
    setTimeout(() => {
      refQrCode && refQrCode.current.snapToItem(0);
    }, 50);
  };

  const refreshQrCode = (item) => {
    setIsLoading(true);
    selectedItem.ticketIndex = refQrCode.current._activeItem;
    selectedItem.ticketDefinitionIndex = currentTicketDefinition;
    console.log("CurrentTicket====", currentTicketDefinition);
    getQrCode(item._id, onRefreshQrCode);
  };

  const onRefreshQrCode = (response) => {
    setIsLoading(false);
    if (response.success) {
      if (
        selectedItem.ticketIndex >= 0 &&
        selectedItem.ticketDefinitionIndex >= 0
      ) {
        let data = dataTicket.slice();
        data[selectedItem.ticketDefinitionIndex].tickets[
          selectedItem.ticketIndex
        ].qrCode = response.data;
        setDataTicket(data);
      } else {
        showAlert("Warning", response.data.Error);
      }
    }
  };

  const showAlert = (title, content) => {
    Alert.alert(
      title,
      content,
      [
        {
          text: "OK",
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TiketComponent
      item={item}
      onBackPress={onBackPress}
      onPressDetail={onPressDetail}
      nextTransferScreen={nextTransferScreen}
      nextSellTicket={nextSellTicket}
      dataTicket={dataTicket}
      currentTicketDefinition={currentTicketDefinition}
      isLoading={isLoading}
      conversionRate={wallets.conversionRate}
      onBeforeSnapChange={onBeforeSnapChange}
      is24Hour={is24Hour}
      refQrCode={refQrCode}
      refreshQrCode={refreshQrCode}
      isShowButton={isShowButton}
      setIsShowButton={setIsShowButton}
      dateFormat={dateFormat}
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
)(TiketScreen);
