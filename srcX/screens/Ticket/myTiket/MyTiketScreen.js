import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import MyTiketComponent from "../../../components/Ticket/myTiket/MyTiketComponent";
import NavigationService from "../../../NavigationService";
import {
  getDataListTicket,
  setNumberMyTickets,
  getPastEvent,
} from "../../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import {
  focusMyTickets,
  focusBlurMyTickets,
} from "../../../redux/actions/event";
import { getDataKeystore, storeKey } from "../../../redux/actions/keyStore";

const initPassEvent = {
  limit: 10,
  page: 1,
  data: [],
  totalDocs: 0,
};
const MyTiketScreen = (props) => {
  const {
    navigation,
    setNumberMyTickets,
    events,
    focusBlurMyTickets,
    showToast,
  } = props;

  // console.log("thai showToast", showToast);

  const [dataToday, setDataToday] = useState([]);
  const [dataComing, setDataComing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [dataPassEvent, setDataPassEvent] = useState(initPassEvent);
  const [isLoadingPassEvent, setIsLoadingPassEvent] = useState(false);

  const [isMorePassEvent, setMorePassEvent] = useState(true);
  const [isShowData, setIsShowData] = useState(false);

  const [isShowToast, setIsShowToast] = useState(false);
  const [dateFormat, setDateFormat] = useState("DD MMMM");

  useEffect(() => {
    handleGetDateFormat();
    getCurrentHourFormat();
    // if (navigation?.state?.params?.showToastDel == true) {
    //   setIsShowToast(true);
    //   setTimeout(() => {
    //     setIsShowToast(false);
    //   }, 3000);
    // }

    //getPastEvent(dataPassEvent.page, dataPassEvent.limit, checkIfHavePastEvent)
  }, []);

  const handleGetDateFormat = async () => {
    const formatDate = await getDataKeystore("@locale");
    if (formatDate) {
      setDateFormat(formatDate);
    }
  };

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
    focusBlurMyTickets();
    setDataPassEvent(initPassEvent);
    getDataListTicket(getMyticketTodayCallBack);
    getPastEvent(1, 10, checkIfHavePastEvent);
  };

  const getMyticketTodayCallBack = (response) => {
    // console.log("thai lof");
    setIsLoading(false);
    setIsRefreshing(false);
    let numberMyTicket = 0;

    // ongoing events
    if (response.onGoingEvents) {
      const data = response.onGoingEvents;
      setDataToday(data);
      for (let i = 0; i < data.length; ++i) {
        numberMyTicket += data[i].totalTickets;
      }
    }

    // upcoming events
    if (response.upComingEvents) {
      const data = response.upComingEvents;
      setDataComing(data);
      for (let i = 0; i < data.length; ++i) {
        numberMyTicket += data[i].totalTickets;
      }
    }
    setNumberMyTickets(numberMyTicket);
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const onPressItem = (item) => {
    NavigationService.navigate("TiketScreen", item);
  };

  const onPressItemGray = (item) => {
    NavigationService.navigate("TicketDetailGrayScreen", item);
  };

  const onRefresh = () => {
    //setIsRefreshing(true);
    getData();
  };

  const getMyticketRefeshCallBack = (response) => {
    setIsRefreshing(false);
    getMyticketTodayCallBack();
  };

  const onPressPassEvent = () => {
    if (!isShowData) {
      setIsShowData(true);
    }
    setIsLoadingPassEvent(true);
    getPastEvent(dataPassEvent.page, dataPassEvent.limit, callBackPastEvent);
  };

  const checkIfHavePastEvent = (response) => {
    setIsLoadingPassEvent(false);
    setIsLoading(false);

    if (response && response.docs.length) {
      setMorePassEvent(false);
    }
  };

  const callBackPastEvent = (response) => {
    setIsLoadingPassEvent(false);

    if (response) {
      setMorePassEvent(response.page >= response.totalPages);
      if (response.docs.length > 0) {
        const page = dataPassEvent.page + 1;
        const data = response.docs;
        const newData = dataPassEvent.data.concat(data);
        const totalDocs = response.totalDocs;

        setDataPassEvent({
          ...dataPassEvent,
          data: newData,
          page: page,
          totalDocs: totalDocs,
        });
      }
    }
  };

  const onCheckoutEvent = () => {
    // console.log("thai props", props);
    NavigationService.navigate("EventsStack");
  };

  return (
    <MyTiketComponent
      onBackPress={onBackPress}
      dataToday={dataToday}
      onPressItem={onPressItem}
      isLoading={isLoading}
      dataComing={dataComing}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      is24Hour={is24Hour}
      onPressPassEvent={onPressPassEvent}
      dataPassEvent={dataPassEvent}
      isLoadingPassEvent={isLoadingPassEvent}
      onPressItemGray={onPressItemGray}
      isMorePassEvent={isMorePassEvent}
      isShowData={isShowData}
      onCheckoutEvent={onCheckoutEvent}
      isShowToast={isShowToast}
      setIsShowToast={setIsShowToast}
      dateFormat={dateFormat}
    />
  );
};
MyTiketScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    events: state.events,
    showToast: state.isShow,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setNumberMyTickets: (payload) => dispatch(setNumberMyTickets(payload)),
  focusBlurMyTickets,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTiketScreen);
