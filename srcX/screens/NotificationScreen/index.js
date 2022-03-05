import React, { useEffect, useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { connect } from "react-redux";
import NotificationList from "../../components/NotificationList/index";
import AppHeader from "../../components/HeaderComponent";
import { getDataKeystore } from "../../redux/actions/keyStore";
import {
  getNotifications,
  getNumUnread,
  minusNumUnread,
  readNotifications,
  reSetNoti,
  cancelTransferTicket,
  acceptTransferTicket,
  autoAcceptTransferTicket,
} from "../../redux/actions/index";
import NavigationService from "../../NavigationService";

const NotificationScreen = (props) => {
  const {
    getNotifications,
    notifications,
    getNumUnread,
    minusNumUnread,
    readNotifications,
    cancelTransferTicket,
    acceptTransferTicket,
  } = props;

  const [isLoadingRead, setisLoadingRead] = useState(false);
  const [dataNoti, setDataNoti] = useState([]);
  const [senderId, setSenderId] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getSenderId();
    const limit = notifications.limit;
    const page = 1;
    getNotifications(page, limit);
    setisLoadingRead(true);
  }, []);

  const getSenderId = async () => {
    const userId = await getDataKeystore("@userId");
    setSenderId(userId);
  };

  useEffect(() => {
    setisLoadingRead(false);
  }, [notifications.numUnread]);

  useEffect(() => {
    if (notifications && notifications.dataNotifications) {
      // console.log("thai noti", notifications.dataNotifications);
      setDataNoti(notifications.dataNotifications);
      setisLoadingRead(false);
    }
  }, [notifications.dataNotifications]);

  const readNotification = (item) => {
    if (item) {
      setisLoadingRead(true);
      readNotifications([item]);
      minusNumUnread();
    } else {
      setisLoadingRead(false);
    }
  };
  const handleLoadMore = () => {
    if (notifications.dataNotifications.length > 0) {
      const limit = notifications.limit;
      const page = notifications.page;
      const pages = notifications.pages;

      if (page >= pages) return;
      if (notifications.isLoading) return;
      getNotifications(page + 1, limit);
    }
  };

  const onAccept = (item, index) => {
    setisLoadingRead(true);
    if (item.metaData)
      acceptTransferTicket(
        item.metaData.xdr,
        item.metaData.hash,
        item.metaData.presignedTransactions,
        item._id,
        onCallBack
      );
  };

  const onCallBack = (response) => {
    setisLoadingRead(false);
  };

  const onDecline = (item, index) => {
    setisLoadingRead(true);
    if (item.metaData && item.metaData.hash)
      cancelTransferTicket(
        item.metaData.hash,
        item._id,
        "DECLINED",
        onCallBack
      );
  };

  const onNextEventDetail = (noti) => {
    if (noti.event) {
      let item = {
        _id: noti.event,
        seller: noti.seller,
      };
      NavigationService.navigate("EventDetailPrivateScreen", { item });
    }
  };

  const onCanelTranfer = (item, index) => {
    setisLoadingRead(true);
    if (item.metaData && item.metaData.hash)
      cancelTransferTicket(
        item.metaData.hash,
        item._id,
        "CANCELLED",
        onCallBack
      );
  };

  const _handleRefresh = () => {
    setIsRefreshing(true);
    const limit = notifications.limit;
    const page = 1;
    getNotifications(page, limit, callBack);
  };

  const callBack = () => {
    setIsRefreshing(false);
  };

  const onNextEventPublicDetail = (itemNoti) => {
    if (itemNoti.event) {
      let eventId = itemNoti.event;
      NavigationService.navigate("EventDetailScreen", { eventId });
    }
  };

  const params = {
    routeNameNotification: "",
    routeNameGoBack: "SendTo",
    countNotice: notifications.numUnread,
    isGoBack: true,
    nameIcon: "close",
    typeIcon: "antdesign",
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader title="NOTIFICATIONS" params={params}>
        <NotificationList
          dataNoti={dataNoti}
          isLoading={notifications.isLoading}
          handleLoadMore={handleLoadMore}
          readNotification={readNotification}
          isLoadingRead={isLoadingRead}
          onAccept={onAccept}
          onDecline={onDecline}
          senderId={senderId}
          onCanelTranfer={onCanelTranfer}
          _handleRefresh={_handleRefresh}
          isRefreshing={isRefreshing}
          onNextEventDetail={onNextEventDetail}
          onNextEventPublicDetail={onNextEventPublicDetail}
        />
      </AppHeader>
    </View>
  );
};

NotificationScreen.navigationOptions = {
  title: "NOTIFICATIONS",
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications,
  };
};

export default connect(
  mapStateToProps,
  {
    getNotifications,
    getNumUnread,
    minusNumUnread,
    readNotifications,
    reSetNoti,
    cancelTransferTicket,
    acceptTransferTicket,
  }
)(NotificationScreen);
