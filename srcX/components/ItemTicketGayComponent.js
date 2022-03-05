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
import { Grayscale } from "react-native-color-matrix-image-filters";
import { getEventAddress } from "../redux/actions/index";
import { getEventImage } from "../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (ItemTicketGayComponent = (props) => {
  const { item, index, isShowNumberTicket, onPressItem, is24Hour } = props;

  if (!item) return null;

  let showTime = "";
  const timeformat = moment(item.startDate).format("llll");
  const indexDot = timeformat.split(",");
  let arrTime = String(indexDot[2]);
  arrTime = arrTime.trim().split(" ");

  if (!is24Hour) {
    showTime = indexDot[0] + "," + indexDot[1];
    // + " - " + arrTime[0] + " " + arrTime[1] + arrTime[2];
  } else {
    let test = moment(item.startDate).format("HH:mm");
    showTime = indexDot[0] + "," + indexDot[1];
    //  + " - " + arrTime[0] + " - " + test;
  }

  let location = getEventAddress(item);
  let imageEvent = getEventImage(item, false);

  return (
    <TouchableOpacity
      onPress={() => onPressItem && onPressItem(item)}
      style={styles.viewItemStyle}
    >
      <CustomImageBackground style={styles.imageItemStyle}>
        <Grayscale>
          <Image source={{ uri: imageEvent }} style={styles.imageItemStyle} />
        </Grayscale>
        {isShowNumberTicket && (
          <ImageBackground
            source={ImageCustom.icNumberGrayTickets}
            style={styles.imageNumberStyle}
            resizeMode="stretch"
          >
            <ImageSvg.IcTicket width={18} height={14} />
            <Text style={styles.txtNumberItemStyle}>{item.totalTickets}</Text>
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
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
  txtTimeStyle: {
    color: "rgba(0, 0, 0, 0.4)",
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
