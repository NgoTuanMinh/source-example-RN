import React from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
} from "react-native";
import { withTheme } from "react-native-elements";
import CircleIcons from "../Icons/CircleIcons";
import HTML from "react-native-render-html";
import moment from "moment";
import defaultAvatar from "../../../assets/images/avatar.png";
import logoX from "../../../assets/images/Union.png";
import NavigationService from "../../NavigationService";
import { fixDecimals } from "../../halpers/utilities";
import * as ImageCustoms from "../Icons/CircleIcons";

const NotificationItem = ({ notification, theme, readNotification }) => {
  const item = notification;
  if (!item) return;
  var reg = /You\sreceived\sX\d+(\.\d+)?\stokens\sfrom/g;
  let array = item.body.match(reg);
  let tokenTransfer = 0;
  if (array && array.length > 0) {
    item.body = item.body.replace(array[0], "");
    const matchItem = array[0].match(/\d+(\.\d+)?/g);
    if (matchItem && matchItem.length > 0)
      tokenTransfer = +matchItem[0];
  }
  const timestamp = moment(item.createdAt).fromNow();
  const leftElement = item.imageUrl ? item.imageUrl : null;

  const onPressNoti = () => {
    if (!item.read) {
      readNotification(item._id);
    }
    if (item.transactionId)
      NavigationService.navigate("TokenTransactionScreen", {
        transactionID: item.transactionId,
      });
  };

  const renderLeftElement = () => {
    return (
      <ImageBackground source={defaultAvatar} style={styles.circle}>
        <Image source={{ uri: leftElement }} style={styles.circle} />
      </ImageBackground>
    );
  };

  if (item.type == "BAR_PAYMENT_SUCCESS") {
    return (
      <TouchableOpacity
        onPress={onPressNoti}
        style={item.read ? styles.containerView : styles.containerSeeView}
      >
        <Image source={ImageCustoms.icBeer} style={styles.circle} />
        <View style={styles.contentStyleVertical}>
          <View style={styles.contentStyle}>
            <Text style={styles.txtStyle}>{item.title} </Text>
            <CircleIcons
              name="logo-regular"
              color="#000"
              size={{ width: 10, height: 9 }}
            />
            {/* <Image source={logoX} style={{ width: 11, height: 12 }} /> */}
            <Text style={[styles.txtStyle, { fontWeight: "bold" }]}>
              {fixDecimals(tokenTransfer)}{" "}
            </Text>
          </View>
          <Text style={styles.timeStyle}>{timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPressNoti}
      style={item.read ? styles.containerView : styles.containerSeeView}
    >
      {renderLeftElement()}
      <View style={styles.contentStyleVertical}>
        <View style={styles.contentStyle}>
          {!tokenTransfer ? (
            <HTML html={item.body} />
          ) : (
            <>
             <Text style={styles.txtStyle}>You received</Text>
              
              <Text style={styles.txtBoldStyle}>
                {" "}
                
              </Text>
              <CircleIcons
                name="logo-regular"
                color="#000"
                size={{ width: 10, height: 9 }}
              />
              {/* <Image source={logoX} style={{ width: 11, height: 12 }} /> */}
              <Text style={[styles.txtStyle]}>
                <Text style={{ height: 9, fontWeight: "bold" }}>
                  {fixDecimals(tokenTransfer)}{" "}
                </Text>
                from{" "}
              </Text>
              <HTML html={item.body} />
            </>
          )}
          {/* <Logo height={10} width={10} color="#000" /> */}

          {/* <TimeAgo time={timestamp} /> */}
        </View>
        <Text style={styles.timeStyle}>{timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(NotificationItem);

const styles = StyleSheet.create({
  containerView: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerSeeView: {
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fdeef3",
  },
  contentStyle: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  contentStyleVertical: {
    marginLeft: 10,
    flexDirection: "column",
    alignSelf: "center",
    marginRight: 20,
  },
  title: {
    fontSize: 16,
    paddingBottom: 4,
    fontWeight: "bold",
    color: "black",
  },
  seetitle: {
    fontSize: 16,
    paddingBottom: 4,
    fontWeight: "bold",
    color: "gray",
  },
  circle: {
    resizeMode: "cover",
    backgroundColor: "transparent",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  timeStyle: {
    color: "gray",
    fontSize: 13,
  },
  txtStyle: {
    fontSize: 13,
    fontWeight: "normal",
  },
  txtBoldStyle: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
