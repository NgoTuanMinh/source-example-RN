import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Platform, Alert } from "react-native";
import SaleDetailTikectComponent from "../../../components/Ticket/saleTicket/SaleDetailTikectComponent";
import NavigationService from "../../../NavigationService";
import {
  getDetailSaleTicket,
  requestUnsellTicket,
} from "../../../redux/actions/index";
import { NavigationActions } from "react-navigation";

const initModal = {
  isShowModal: false,
  type: "PUBLIC",
};
const SaleDetailTikectScreen = (props) => {
  const { navigation, wallets } = props;
  const event =
    props.navigation?.state?.params.event || props.navigation?.state?.params;
  const [statusToast, setStatusToast] = useState(
    props.navigation?.state?.params.statusToast || ""
  );

  //   console.log("thai event", props.navigation?.state?.params);
  const [isShowModal, setIsShowModal] = useState(initModal);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataMarketplace, setDataMarketplace] = useState({
    publicSaleTickets: [],
    privateSaleTickets: [],
  });
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShowToast, setIsShowToast] = useState(false);
  const backAction = NavigationActions.back({
    key: null,
  });

  useEffect(() => {
    setIsLoading(true);
    getDetailSaleTicket(event._id, onCallBack);
    setIsShowToast(true);
    setTimeout(() => {
      setIsShowToast(false);
    }, 3000);
  }, []);

  const groupTicketsByCost = (tickets) => {
    let mapTickets = tickets.reduce((arrCost, item) => {
      arrCost[item.tokens] = arrCost[item.tokens] ?? [];
      arrCost[item.tokens].push(item);
      return arrCost;
    }, []);

    let result = [];
    for (const [key, value] of Object.entries(mapTickets)) {
      console.log(value);
      result.push({ tokens: key, tickets: value });
    }

    return result;
  };

  const setSaleTicketData = (dataTickets, index) => {
    setCurrentIndex(index);
    if (index >= dataTickets.length) return;

    const tickets = dataTickets[index].tickets;

    const publicSaleTickets = groupTicketsByCost(
      tickets.filter((s) => s.saleType === "PUBLIC")
    );
    const privateSaleTickets = groupTicketsByCost(
      tickets.filter((s) => s.saleType === "PRIVATE")
    );

    setDataMarketplace({ publicSaleTickets, privateSaleTickets });
  };

  const onCallBack = (response) => {
    if (response) {
      setData(response);
      setSaleTicketData(response, 0);
    }
    setIsLoading(false);
  };

  const onBackPress = () => {
    // Navigation.dispatch(backAction);
    // Navigation.dispatch(backAction);
    NavigationService.goBack();
    NavigationService.navigate("TicketsStack");
    // console.log("thai thai thai");
  };

  const onToggleModal = () => {
    setIsShowModal({
      ...isShowModal,
      isShowModal: !isShowModal.isShowModal,
    });
  };

  const onToggleModalPublic = () => {
    setIsShowModal({
      isShowModal: !isShowModal.isShowModal,
      type: "PUBLIC",
    });
  };

  const onToggleModalPrivate = () => {
    setIsShowModal({
      isShowModal: !isShowModal.isShowModal,
      type: "PRIVATE",
    });
  };

  const editTicket = (editItem) => {
    let item = {
      ...data[currentIndex],
      tickets: editItem.tickets,
    };
    NavigationService.navigate("SaleDetailEditTikectScreen", { item, event });
  };

  const onBackTicketWallet = () => {
    NavigationService.navigate("TicketsStack");
  };

  const onDetails = () => {
    NavigationService.navigate("EventDetailScreen", { eventId: event._id });
  };

  const onBeforeSnapChange = (index) => {
    setSaleTicketData(data, index);
  };

  const unSellTicket = (item) => {
    setIsLoading(true);
    requestUnsellTicket(
      item.tickets.map((s) => s.issuerId),
      onCallbackUnsellTickets
    );
  };

  const onPressSaleTiketScreen = () => {
    NavigationService.navigate("TicketsStack");
  };

  const onCallbackUnsellTickets = (response) => {
    setIsLoading(false);
    if (response.success) {
      // Alert.alert(
      //   "Alert",
      //   "Success!",
      //   [{ text: "OK", onPress: () => onPressSaleTiketScreen() }],
      //   { cancelable: true }
      // );
      NavigationService.goBack();
      NavigationService.navigate("SaleStack", {
        event: event,
        statusToast: "Ticket listing deleted successfully ",
      });
      // setStatusToast("Ticket listing deleted successfully");
      // setIsShowToast(true);
      // setTimeout(() => {
      //   setIsShowToast(false);
      // }, 3000);
    }
  };

  const onPressSentTo = () => {
    const dataProps =
      isShowModal.type == "PRIVATE"
        ? dataMarketplace.privateSaleTickets
        : dataMarketplace.publicSaleTickets;
    onToggleModal();
    NavigationService.navigate("SentToTicketScreen", { dataProps });
  };

  return (
    <SaleDetailTikectComponent
      onBackPress={onBackPress}
      isShowModal={isShowModal}
      onToggleModal={onToggleModal}
      editTicket={editTicket}
      onBackTicketWallet={onBackTicketWallet}
      onDetails={onDetails}
      event={event}
      isLoading={isLoading}
      data={data}
      currentIndex={currentIndex}
      onBeforeSnapChange={onBeforeSnapChange}
      dataMarketplace={dataMarketplace}
      conversionRate={wallets.conversionRate}
      deleteTicket={unSellTicket}
      onPressSentTo={onPressSentTo}
      onToggleModalPrivate={onToggleModalPrivate}
      onToggleModalPublic={onToggleModalPublic}
      isShowToast={isShowToast}
      setIsShowToast={setIsShowToast}
      statusToast={statusToast}
    />
  );
};

SaleDetailTikectScreen.navigationOptions = {
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
)(SaleDetailTikectScreen);
