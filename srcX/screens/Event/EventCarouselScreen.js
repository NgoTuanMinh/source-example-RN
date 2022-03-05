import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import CustomImageBackground from "../../components/CustomImageBackground";
import * as ImageCustom from "../../components/Icons/CircleIcons/index";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { getEventAddress } from "../../redux/actions/index";
import { getEventImage } from "../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const EventCarouselScreen = (props) => {
  const { item, onPressItem } = props;

  const timeformat = moment(item.startTime).format("llll");
  const indexDot = timeformat.split(",");

  let location = getEventAddress(item);
  // console.log(item);
  // console.log("thai meo", item.imageUrls[0]);

  return (
    <TouchableOpacity
      onPress={() => onPressItem && onPressItem(item)}
      style={styles.walletContainer}
    >
      <View style={styles.walletShadow}>
        <CustomImageBackground style={styles.imageBgEventStyle}>
          <Image
            source={{ uri: getEventImage(item, false) }}
            style={styles.imageEventStyle}
          />
          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0.05)",
              "rgba(0, 0, 0, 0.1)",
              "rgba(0, 0, 0, 0.3)",
              "rgba(0, 0, 0, 0.8)",
              "#000000",
              "#000000",
            ]}
            style={[
              styles.imageBgEventStyle,
              {
                justifyContent: "flex-end",
                paddingLeft: 10,
                paddingVertical: 10,
              },
            ]}
          >
            <Text style={styles.txtTimeStyle}>
              {indexDot[0] + "," + indexDot[1]}
            </Text>

            <Text numberOfLines={1} style={styles.txtTileStyle}>
              {item.name}
            </Text>

            <Text numberOfLines={1} style={styles.txtLocalStyle}>
              {location}
            </Text>
          </LinearGradient>
        </CustomImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default EventCarouselScreen;

const styles = StyleSheet.create({
  walletContainer: {
    width: deviceWidth - 100,
    height: 170,
    marginVertical: 20,
  },

  walletShadow: {
    shadowColor: "black",
    shadowOffset: { width: 5, height: 30 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  imageEventStyle: {
    width: deviceWidth - 100,
    height: 170,
    alignSelf: "center",
    resizeMode: "stretch",
  },
  imageBgEventStyle: {
    width: deviceWidth - 100,
    height: 170,
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
    alignSelf: "center",
  },
  txtTimeStyle: {
    color: "#EA5284",
    fontSize: 14,
    fontFamily: "Lato",
  },
  txtTileStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Lato",
    marginVertical: 2,
    marginRight: 10,
  },
  txtLocalStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
    marginRight: 10,
  },
});
