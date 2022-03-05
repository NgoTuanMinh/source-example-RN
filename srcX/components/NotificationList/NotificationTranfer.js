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
import icBuyTicket from "../../../assets/images/icBuyTicket.png";
import NavigationService from "../../NavigationService";
import Logo from "../Icons/TabIcons/Logo";
import IcLogout from "../../../assets/images/svg/logout.svg";
import { fixDecimals } from "../../halpers/utilities";
import * as ImageCustoms from "../Icons/CircleIcons";

const NotificationTranfer = ({
  notification,
  theme,
  senderId,
  onAccept,
  onDecline,
  onCanelTranfer,
  readNotification,
}) => {
  const item = notification;
  if (!item) return;
  const timestamp = moment(item.createdAt).fromNow();
  const onPressAccept = () => {
    onAccept(item);
  };
  const onPressDecline = () => {
    onDecline(item);
  };

  const onPressCancel = () => {
    onCanelTranfer(item);
  };

  const onPressSee = () => {
    if (!item.read) {
      readNotification(item._id);
    }
  };

  const renderLeftElement = () => {
    return (
      //   <View style={styles.circle}>
      <Image source={icBuyTicket} style={styles.iconStyle} />
      //   </View>
    );
  };

  const renderWaiting = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onPressDecline}>
          <Text style={styles.txtDeclineStyle}>DECLINE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressAccept}>
          <Text style={styles.txtAcceptStyle}>ACCEPT</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAccess = (type) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {type === "RECEIVED_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TICKET ACCEPTED
          </Text>
        )}
        {type === "TRANSFER_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TRANSFER ACCEPTED
          </Text>
        )}
      </View>
    );
  };

  const renderDeclined = (type) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {type === "RECEIVED_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TICKET DECLINED
          </Text>
        )}
        {type === "TRANSFER_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TRANSFER DECLINED
          </Text>
        )}
      </View>
    );
  };

  const renderFailed = (type) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {type === "RECEIVED_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TICKET FAILED
          </Text>
        )}
        {type === "TRANSFER_TICKET" && (
          <Text
            style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}
          >
            TRANSFER FAILED
          </Text>
        )}
      </View>
    );
  };

  const renderReject = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.2)" }]}>
          TRANSFER CANCELLED
        </Text>
      </View>
    );
  };

  const renderYouReject = () => {
    return (
      <TouchableOpacity
        onPress={onPressCancel}
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text style={[styles.txtDeclineStyle, { color: "rgba(0, 0, 0, 0.4)" }]}>
          CANCEL TRANSFER
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity onPress={onPressSee}>
      <View style={item.read ? styles.containerView : styles.containerSeeView}>
        <View style={{ flexDirection: "row" }}>
          {renderLeftElement()}
          <View style={styles.contentStyleVertical}>
            <View style={styles.contentStyle}>
              <HTML html={item.body} />
            </View>
            <Text style={styles.timeStyle}>{timestamp}</Text>
          </View>
        </View>
        {item.metaData.status == "SUBMITTED" && renderAccess(item.type)}
        {item.metaData.status == "CANCELLED" && renderReject(item.type)}
        {item.metaData.status == "FAILED" && renderFailed(item.type)}
        {/* {item.metaData.status == "WAITING ACCEPT" &&
          item.type == "RECEIVED_TICKET" &&
          renderWaiting()}
        {item.metaData.status == "WAITING ACCEPT" &&
          item.type == "TRANSFER_TICKET" &&
          renderYouReject()} */}
        {item.metaData.status == "DECLINED" && renderDeclined(item.type)}
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(NotificationTranfer);

const styles = StyleSheet.create({
  containerView: {
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  containerSeeView: {
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
    backgroundColor: "#FBCF9C",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    width: 50,
    height: 50,
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
  txtDeclineStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.4)",
  },
  txtAcceptStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EA5284",
    marginLeft: 15,
  },
});
