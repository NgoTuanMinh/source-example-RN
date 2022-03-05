import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import { Text } from "react-native-elements";
import { withTheme } from "react-native-elements";
import NotificationItem from "./NotificationItem";
import NotificationTranfer from "./NotificationTranfer";
import NotiItemPrivateTickets from "./NotiItemPrivateTickets";
import NotiItemPublicTickets from "./NotiItemPublicTickets";

const NotificationList = (props) => {
  const {
    dataNoti,
    handleLoadMore,
    isLoading,
    readNotification,
    isLoadingRead,
    onAccept,
    onDecline,
    senderId,
    onCanelTranfer,
    isRefreshing,
    _handleRefresh,
    onNextEventDetail,
    onNextEventPublicDetail,
  } = props;

  let newNotifications = [];
  let historyNotifications = [];
  if (dataNoti && dataNoti.length > 0) {
    dataNoti.map((item) => {
      if (item.read) {
        historyNotifications.push(item);
      } else {
        newNotifications.push(item);
      }
    });
  }

  const sortByTime = (item1, item2) => {
    const time1 = item1.createdAt;
    const time2 = item2.createdAt;
    return time1 < time2 ? 1 : time2 < time1 ? -1 : 0;
  };
  historyNotifications.sort(sortByTime);

  const DATA = [
    {
      title: "NEW",
      data: newNotifications,
    },
    {
      title: "EARLIER",
      data: historyNotifications,
    },
  ];

  const renderLoading = () => {
    if (!isLoadingRead) return null;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#EA5284" />
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="large" color="#EA5284" />;
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={{}}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {
            if (
              item.type == "TRANSFER_TICKET" ||
              item.type == "RECEIVED_TICKET"
            )
              return (
                <NotificationTranfer
                  onAccept={onAccept}
                  onDecline={onDecline}
                  readNotification={readNotification}
                  key={index}
                  notification={item}
                  senderId={senderId}
                  onCanelTranfer={onCanelTranfer}
                />
              );

            if (item.type == "PRIVATE_SHARED_TICKET")
              return (
                <NotiItemPrivateTickets
                  onNextEventDetail={onNextEventDetail}
                  notification={item}
                  readNotification={readNotification}
                />
              );

            if (item.type == "PUBLIC_SHARED_TICKET")
              return (
                <NotiItemPublicTickets
                  notification={item}
                  readNotification={readNotification}
                  onNextEventDetail={onNextEventPublicDetail}
                />
              );

            return (
              <NotificationItem
                readNotification={readNotification}
                key={index}
                notification={item}
              />
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.day}>{title}</Text>
          )}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          refreshing={isRefreshing}
          onRefresh={_handleRefresh}
        />
      </ScrollView>
      {renderLoading()}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    newNotification: state.wallets.contacts.evtxContacts,
    historyNotification: state.wallets.contacts.unEvtxContacts,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withTheme(NotificationList));

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  day: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "gray",
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .3)",
  },
});
