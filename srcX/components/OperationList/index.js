import React, { useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { withTheme } from "react-native-elements";
import OperationListItem from "./OperationListItem";
import moment from "moment";
import { translate } from "../../../App";

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 10,
    width: "100%",
    justifyContent: "center",
  },
  coming: {
    fontSize: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 60,
  },
});

const OperationList = ({
  currentCardId,
  transactions,
  style = {},
  theme,
  conversionRate,
  isLoadingMore,
  userId,
  refreshing,
  isLoading,
  is24Hour,
}) => {
  // console.log("thai trasac", transactions.data);
  let currentDate = "";
  if (currentCardId !== 0) {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.coming, { color: theme.colors.gray }]}>
          {translate("ComingSoon")}
        </Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isLoadingMore || isLoading) return null;
    if (refreshing) return null;
    return <ActivityIndicator size="large" color="gray" />;
  };

  return (
    <FlatList
      data={transactions.data}
      style={style}
      keyExtractor={(item, index) => String(index)}
      contentContainerStyle={styles.list}
      nestedScrollEnabled={true}
      renderItem={(item) => {
        if (!item.item) return null;
        const transactionDate = moment(item.item.updatedAt).format(
          "MM/DD/YYYY"
        );
        const formattedDay = moment(item.item.updatedAt)
          .format("DD MMM")
          .toUpperCase();
        let showTime = "";
        if (!is24Hour) {
          const timeformat = moment(item.item.updatedAt).format("llll");
          const indexDot = timeformat.split(",");
          let arrTime = String(indexDot[2]);
          arrTime = arrTime.trim().split(" ");
          showTime = arrTime[1] + " " + arrTime[2];
        } else {
          showTime = moment(item.item.updatedAt).format("HH:mm");
        }

        let newDay = false;
        if (!moment(transactionDate).isSame(moment(currentDate))) {
          newDay = true;
          currentDate = transactionDate;
        }
        return (
          <OperationListItem
            data={item.item}
            newDay={newDay}
            formattedDay={formattedDay}
            formattedtime={showTime}
            conversionRate={conversionRate}
            userId={userId}
          />
        );
      }}
      ListFooterComponent={renderFooter}
      // onEndReachedThreshold={0.05}
      // onEndReached={getMoreDate}
    />
  );
};

export default withTheme(OperationList);
