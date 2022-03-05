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
import moment from "moment";
import defaultAvatar from "../../../assets/images/avatar.png";
import NavigationService from "../../NavigationService";
import { fixDecimals } from "../../halpers/utilities";
import * as ImageCustoms from "../Icons/CircleIcons";
import HTML from "react-native-render-html";

const NotiItemPrivateTickets = ({
  notification,
  readNotification,
  onNextEventDetail,
}) => {
  const item = notification;
  if (!item) return;

  const leftElement = item.imageUrl ? item.imageUrl : "";
  const timestamp = moment(item.createdAt).fromNow();

  const onPressNoti = () => {
    if (!item.read) {
      readNotification && readNotification(item._id);
    }
    onNextEventDetail(item);
  };

  const renderLeftElement = () => {
    return (
      <ImageBackground source={defaultAvatar} style={styles.circle}>
        <Image source={{ uri: leftElement }} style={styles.circle} />
      </ImageBackground>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPressNoti}
      style={item.read ? styles.containerView : styles.containerSeeView}
    >
      {renderLeftElement()}
      <View style={styles.contentStyleVertical}>
        <View style={styles.contentStyle}>
          <HTML html={item.body} />
        </View>
        <Text style={styles.timeStyle}>{timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(NotiItemPrivateTickets);

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
    marginRight: 40,
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
