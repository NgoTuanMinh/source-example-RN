import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  RefreshControl,
  Platform,
  Animated,
  AppState,
  ActivityIndicator,
  Linking,
  Text,
  FlatList,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import { connect } from "react-redux";
import OperationList from "../../components/OperationList";
import CarouselEvent from "./CarouselEvent";
import AppHeader from "../../components/HeaderComponent";
import {
  getTransactionsOfWallet,
  getWallet,
  getNumUnread,
  readNotifications,
  plusNumUnread,
  verifyEmailUrl,
  getProfileDetails,
  getEventToday,
  getEventComing,
} from "../../redux/actions/index";

import { translate } from "../../../App";
import { submitRegisterToken } from "../../redux/actions/notifications";
import { notifications } from "react-native-firebase-push-notifications";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { getDeviceName } from "react-native-device-info";
import NavigationService from "../../NavigationService";
import { getDataKeystore, storeKey } from "../../redux/actions/keyStore";
import * as NewRelicRN from "../../../NewRelicRN";
import ItemEventComponent from "../../components/ItemEventComponent";
import Strings from "../../constants/String";
import { is24HourFormat } from "react-native-device-time-format";
import moment from "moment";

const intidataEvent = {
  limit: 5,
  page: 1,
  pages: 1,
  totalPages: 1,
  isLoadingMore: false,
  docs: [],
};
const EventScreen = (props) => {
  const {
    navigation,
    wallets,
    getWallet,
    getNumUnread,
    getProfileDetails,
    getTransactionsOfWallet,
  } = props;

  const [dataEventToday, setDataEventToday] = useState({ ...intidataEvent });
  const [dataEventComing, setDataEventComing] = useState({ ...intidataEvent });
  const [refreshing, setRefreshing] = useState(true);
  const [reload, setReload] = useState(true);
  const [is24Hour, setIs24Hour] = useState(false);
  const [dateFormat, setDateFormat] = useState("DD MMMM");

  useEffect(() => {
    handleGetDateFormat();
    NewRelicRN.nrInteraction("Event Screen");
    getCurrentHourFormat();
    getEventToday(1, 5, onCallBackToday);
    getEventComing(1, 5, onCallBackComing);
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getEventToday(1, 5, onCallBackToday);
    getEventComing(1, 5, onCallBackComing);
  }, []);

  const onCallBackComing = (response) => {
    setRefreshing(false);
    setReload(false);
    setDataEventComing({ ...response, isLoadingMore: false });
  };

  const onCallBackToday = (response) => {
    // console.log("thai today", response.docs[0].imageUrls);
    setRefreshing(false);
    setReload(false);
    setDataEventToday({ ...response, isLoadingMore: false });
  };

  const onCallBackComingUpdate = (response) => {
    setDataEventComing({
      ...dataEventComing,
      docs: dataEventComing.docs.concat(response.docs),
      page: response.page,
      isLoadingMore: false,
      totalPages: response.totalPages,
    });
  };

  const onCallBackTodayUpdate = (response) => {
    setDataEventToday({
      ...dataEventToday,
      docs: dataEventToday.docs.concat(response.docs),
      page: response.page,
      isLoadingMore: false,
      totalPages: response.totalPages,
    });
  };

  const renderLoading = useMemo(() => {
    if (!reload) {
      return;
    }
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }, [reload]);

  const onPressItem = (item) => {
    NavigationService.navigate("EventDetailScreen", { item });
    // console.log("thai", item);
  };

  const renderItem = ({ item, index }) => {
    return (
      <ItemEventComponent
        item={item}
        index={index}
        isShowNumberTicket={false}
        onPressItem={onPressItem}
        is24Hour={is24Hour}
        dateFormat={dateFormat}
      />
    );
  };

  const onPressSearch = () => {
    NavigationService.navigate("SearchEventStack");
  };

  const handleLoadMoreTodayEvents = () => {
    const page = dataEventComing.page;
    const limit = dataEventComing.limit;

    getEventComing(page + 1, limit, onCallBackComingUpdate);
  };

  const getMoreTodayEvents = () => {
    if (!dataEventComing.isLoadingMore) {
      setDataEventComing({ ...dataEventComing, isLoadingMore: true });
      handleLoadMoreTodayEvents();
    }
  };

  const renderFooter = () => {
    return <ActivityIndicator size="large" color="#EA5284" />;
  };

  const handleLoadMoreOnGoingEvents = () => {
    const page = dataEventToday.page;
    const limit = dataEventToday.limit;

    getEventToday(page + 1, limit, onCallBackTodayUpdate);
  };

  const getMoreOngoingEvents = () => {
    if (!dataEventToday.isLoadingMore) {
      setDataEventToday({ ...dataEventToday, isLoadingMore: true });
      handleLoadMoreOnGoingEvents();
    }
  };

  const renderListComingEvent = useMemo(() => {
    let dataShowEventComing = dataEventComing.docs
      ? dataEventComing.docs
      : null;

    let isShowBtnComing = false;
    if (dataEventComing.totalPages > dataEventComing.page) {
      isShowBtnComing = true;
    }

    if (!dataShowEventComing) return;

    return (
      <View>
        <View style={[styles.flatlistStyle]}>
          <Text style={styles.titleFlatlistStyle}>{translate("UpComing")}</Text>
          <FlatList
            data={dataShowEventComing}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
          />
          {isShowBtnComing && (
            <TouchableOpacity
              onPress={getMoreTodayEvents}
              style={styles.btnPassEvent}
            >
              <Text style={styles.txtPassEvent}>
                {translate("More_Upcoming_Events")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {dataEventComing.isLoadingMore && renderFooter()}
      </View>
    );
  }, [dataEventComing]);

  const renderlistOnGoing = useMemo(() => {
    let dataShowEventToday = dataEventToday ? dataEventToday.docs : null;
    let showBtnOnGoingEventToday = false;

    if (dataEventToday.totalPages > dataEventToday.page) {
      showBtnOnGoingEventToday = true;
    }
    if (!dataShowEventToday) return;

    return (
      <View style={[styles.flatlistStyle]}>
        <Text style={styles.titleFlatlistStyle}>{translate("OnGoing")}</Text>
        <FlatList
          data={dataShowEventToday}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(index)}
        />
        {showBtnOnGoingEventToday && (
          <TouchableOpacity
            onPress={getMoreOngoingEvents}
            style={styles.btnPassEvent}
          >
            <Text style={styles.txtPassEvent}>
              {translate("More_OnGoing_Events")}
            </Text>
          </TouchableOpacity>
        )}
        {dataEventToday.isLoadingMore && renderFooter()}
      </View>
    );
  }, [dataEventToday]);

  const renderListEvent = useMemo(() => {
    let dataShowEventToday = dataEventToday ? dataEventToday.docs : null;
    // console.log("thai dataa", dataShowEventToday);
    const dataComing = props.event.data;

    return (
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={160}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CarouselEvent
          walletCarousel
          conversionRate={wallets.conversionRate}
          data={dataShowEventToday || []}
          dataComing={dataComing ? dataComing.slice(0, 3) : []}
          onPressItem={onPressItem}
        />

        {renderlistOnGoing}
        {renderListComingEvent}
      </Animated.ScrollView>
    );
  }, [dataEventComing, dataEventToday, refreshing]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        isSearch
        title={translate("Events")}
        params={{ isNotification: true }}
        onPressSearch={onPressSearch}
      >
        {renderListEvent}
        {renderLoading}
      </AppHeader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 100,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  flatlistStyle: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  titleFlatlistStyle: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  btnPassEvent: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },
  txtPassEvent: {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: 12,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

EventScreen.navigationOptions = {
  title: "Events",
  headerShown: false,
  headerMode: "none",
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    transactions: state.transactions,
    profile: state.profile,
    event: state.events,
  };
};

export default connect(
  mapStateToProps,
  {
    getTransactionsOfWallet,
    getWallet,
    getNumUnread,
    readNotifications,
    plusNumUnread,
    verifyEmailUrl,
    getProfileDetails,
  }
)(EventScreen);
