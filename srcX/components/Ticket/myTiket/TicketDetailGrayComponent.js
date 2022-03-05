import React, { useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { translate } from "../../../../App";
import QRCode from "react-native-qrcode-svg";
import { Icon } from "react-native-elements";
import moment from "moment";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import CircleIcons from "../../Icons/CircleIcons";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import CustomImageBackground from "../../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import { fixDecimals } from "../../../halpers/utilities";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import { isIphoneXorAbove } from "../../../utils/CheckTypeToken";
import CarouselTiketDetailComponent from "./CarouselTiketDetailComponent";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (TicketDetailGrayComponent = (props) => {
  const {
    navigation,
    onBackPress,
    item,
    dataTicket,
    currentTicketDefinition,
    onPressDetail,
    nextTransferScreen,
    nextSellTicket,
    isLoading,
    conversionRate,
    onBeforeSnapChange,
    is24Hour,
    refQrCode,
  } = props;

  const renderLoading = useMemo(() => {
    if (!isLoading) return;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  return (
    <View style={[styles.containter, {}]}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            {item ? item.name : ""}
          </Text>
          <Text style={styles.txtDetail} onPress={onPressDetail}>
            Details
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <CarouselTiketDetailComponent
            nextTransferScreen={nextTransferScreen}
            nextSellTicket={nextSellTicket}
            ticketDefinitions={dataTicket}
            event={item}
            currentTicketDefinition={currentTicketDefinition}
            conversionRate={conversionRate}
            onBeforeSnapChange={onBeforeSnapChange}
            is24Hour={is24Hour}
            isShowBtn={false}
            isReshesh={false}
            opacityQRcode={0.2}
            refQrCode={refQrCode}
          />
          {renderLoading}
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewHeaderStyle: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 56,
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleHeaderStyle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    maxWidth: "70%",
    alignSelf: "center",
    fontFamily: "Lato",
    textTransform: "uppercase",
  },
  txtDetail: {
    color: "#EA5284",
    fontSize: 16,
    fontFamily: "Lato",
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
