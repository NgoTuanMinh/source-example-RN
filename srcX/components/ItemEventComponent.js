import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import * as ImageSvg from "./Icons/CircleIcons/ImageSvg";
import moment from "moment";
import CustomImageBackground from "./CustomImageBackground";
import * as ImageCustom from "./Icons/CircleIcons/index";
import FastImage from "react-native-fast-image";
import { getEventAddress } from "../redux/actions/index";
const deviceWidth = Dimensions.get("window").width;
import { getEventImage } from "../halpers/utilities";

export default (ItemEventComponent = (props) => {
  const {
    item,
    index,
    isShowNumberTicket,
    onPressItem,
    is24Hour,
    dateFormat,
  } = props;

  if (!item) return null;

  let showTime = "";
  const dateFM = moment(item.startDate).format(dateFormat);
  const timeformat = moment(item.startDate).format("llll");
  const indexDot = timeformat.split(",");
  let arrTime = String(indexDot[2]);
  arrTime = arrTime.trim().split(" ");
  if (!is24Hour) {
    // showTime = indexDot[0] + "," + indexDot[1]; //+ " - " + arrTime[0] + " " + arrTime[1] + arrTime[2];
    showTime = indexDot[0] + ", " + dateFM;
  } else {
    let test = moment(item.startDate).format("HH:mm");
    // showTime = indexDot[0] + "," + indexDot[1]; //+ " - " + arrTime[0] + " - " + test;
    showTime = indexDot[0] + ", " + dateFM;
  }

  let location = getEventAddress(item);
  let imageEvent = getEventImage(item);

  return (
    <TouchableOpacity
      onPress={() => onPressItem && onPressItem(item)}
      style={styles.viewItemStyle}
    >
      <CustomImageBackground style={styles.imageItemStyle}>
        <FastImage
          style={styles.imageItemStyle}
          source={{
            uri: imageEvent,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />

        {isShowNumberTicket && (
          <ImageBackground
            source={ImageCustom.icNumberTickets}
            style={styles.imageNumberStyle}
            resizeMode="stretch"
          >
            <ImageSvg.IcTicket width={18} height={14} />
            <Text style={styles.txtNumberItemStyle}>4</Text>
          </ImageBackground>
        )}
      </CustomImageBackground>

      <View style={styles.viewInfoItemStyle}>
        <Text style={styles.txtTimeStyle}>{showTime}</Text>
        <Text numberOfLines={2} style={styles.txtTileStyle}>
          {item.name}
        </Text>
        <Text style={styles.txtLocalStyle}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
});

ItemEventComponent.defaultProps = {
  isShowNumberTicket: true,
  is24Hour: false,
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 110,
  },
  viewItemStyle: {
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 5,
  },

  imgBackGround: {
    height: 80,
    width: 80,
    resizeMode: "stretch",
  },
  imageItemStyle: {
    height: 80,
    width: 80,
    resizeMode: "stretch",
  },
  imageNumberStyle: {
    height: 45,
    width: 45,
    resizeMode: "stretch",
    position: "absolute",
    left: 0,
    bottom: 0,
    // justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
  txtTimeStyle: {
    color: "#EA5284",
    fontSize: 14,
    fontFamily: "Lato",
  },
  txtTileStyle: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Lato",
    marginVertical: 2,
  },
  txtLocalStyle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
    fontFamily: "Lato",
  },
  viewInfoItemStyle: {
    marginLeft: 15,
    flex: 1,
  },
  txtNumberItemStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
  },
});
