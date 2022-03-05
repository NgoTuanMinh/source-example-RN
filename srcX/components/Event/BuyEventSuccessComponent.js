import React, { useCallback, useMemo } from "react";
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
  SafeAreaView,
} from "react-native";
import { translate } from "../../../App";
import { Icon } from "react-native-elements";
import * as ImageSvg from "../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../Icons/CircleIcons/index";
import CustomImageBackground from "../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CircleIcons from "../Icons/CircleIcons";
import { fixDecimals } from "../../halpers/utilities";
import { Section } from "../Layout/index";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (BuyEventSuccessComponent = (props) => {
  const { onBackPress, onNextDetailEvent } = props;

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 50,
          }}
        >
          <Image source={ImageCustom.icSuccess} style={styles.icSuccess} />
          <Text style={styles.txtSuccessStyle}>Payment successful</Text>
          <Text style={styles.txtDetailStyle}>
            The ticket(s) have been added to your Tickets.
          </Text>
        </View>

        <View>
          <TouchableOpacity onPress={onBackPress}>
            <LinearGradient
              colors={["#FF6195", "#C2426C"]}
              style={styles.linearGradientNextStyle}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.txtNumberTicketStyle}>view my tickets</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onNextDetailEvent}>
            <View style={styles.viewBorderStyle}>
              <Text
                style={[
                  styles.txtNumberTicketStyle,
                  { color: "rgba(0, 0, 0, 0.4)" },
                ]}
              >
                back to event details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  viewContainerStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
    paddingBottom: 30,
  },
  linearGradientNextStyle: {
    flexDirection: "row",
    width: "90%",
    // height: 55,
    paddingVertical: 15,
    alignSelf: "center",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  viewBorderStyle: {
    flexDirection: "row",
    width: "90%",
    // height: 55,
    paddingVertical: 15,
    alignSelf: "center",
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
  },
  txtNumberTicketStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 20,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: 15,
  },
  txtSuccessStyle: {
    fontSize: 24,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
  },
  icSuccess: {
    width: 74,
    height: 74,
    resizeMode: "contain",
  },
  txtDetailStyle: {
    fontSize: 16,
    fontFamily: "Lato",
    marginTop: 10,
    color: "rgba(0, 0, 0, 0.4)",
  },
});
