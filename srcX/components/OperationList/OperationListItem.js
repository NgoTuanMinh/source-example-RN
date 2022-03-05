import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text, withTheme } from "react-native-elements";
import Swipeable from "react-native-swipeable-row";
import ListItemComponent from "../ListItemComponent";
import { withNavigation } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import CircleIcons from "../Icons/CircleIcons";

const OperationListItem = ({
  data,
  theme,
  navigation,
  newDay,
  formattedDay,
  formattedtime,
  conversionRate,
  userId,
  is24Hour,
}) => {
  const isPending = data.status === "PENDING";
  const onItemPress = (trans) => {
    if (
      data.kind == "PurchaseTicketTransaction" ||
      data.kind == "BuySaleTicketTransaction"
    ) {
      navigation.navigate("BuyEventTransactionScreen", {
        data: trans,
        conversionRate: conversionRate,
        userId: userId,
      });
      return;
    }

    if (trans.kind === "PurchaseTransaction") {
      navigation.navigate("BarPaymentScreen", {
        operationId: trans.id,
        title: "Bar Payment",
        data: trans,
        conversionRate: conversionRate,
        userId: userId,
      });
      return;
    }
    if (trans.kind === "TopupTransaction") {
      navigation.navigate("OperationDetail", {
        operationId: trans.id,
        title: "TOP-UP DETAILS",
        data: trans,
        conversionRate: conversionRate,
        userId: userId,
      });
    } else {
      navigation.navigate("TokenTransactionScreen", {
        transactionID: trans.id,
        userId: userId,
      });
    }
  };

  const ActionButtons = [
    <TouchableOpacity
      onPress={() => {
        onItemPress(data);
      }}
    >
      <LinearGradient
        style={styles.buttons}
        colors={theme.colors.primaryGradient}
      >
        <CircleIcons name="details" noCircle />
        <Text style={styles.buttonText}>Details</Text>
      </LinearGradient>
    </TouchableOpacity>,
  ];

  return (
    <>
      {newDay ? (
        <View style={styles.dayWrapper}>
          <Text style={[{ color: theme.colors.gray }, styles.day]}>
            {formattedDay}
          </Text>
        </View>
      ) : null}
      <Swipeable rightButtons={ActionButtons}>
        <View style={{ opacity: isPending ? 0.4 : 1 }}>
          <ListItemComponent
            data={data}
            userId={userId}
            formattedtime={isPending ? "Pending" : formattedtime}
            conversionRate={conversionRate}
            onPress={() => (isPending ? {} : onItemPress(data))}
          />
        </View>
      </Swipeable>
    </>
  );
};

export default withNavigation(withTheme(OperationListItem));

const styles = StyleSheet.create({
  buttons: {
    width: 76,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    paddingTop: 7,
    color: "#fff",
  },
  dayWrapper: {
    padding: 15,
    paddingTop: 25,
  },
  day: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
