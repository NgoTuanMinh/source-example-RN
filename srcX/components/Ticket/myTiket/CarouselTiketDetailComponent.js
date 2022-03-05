import React, { useMemo, useRef } from "react";
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
import {
  fixDecimals,
  convertTokensToCurrency,
} from "../../../halpers/utilities";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import { isIphoneXorAbove } from "../../../utils/CheckTypeToken";
import { Grayscale } from "react-native-color-matrix-image-filters";
import { getEventImage } from "../../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (CarouselTiketDetailComponent = (props) => {
  const {
    nextTransferScreen,
    nextSellTicket,
    ticketDefinitions,
    currentTicketDefinition,
    event,
    conversionRate,
    onBeforeSnapChange,
    is24Hour,
    isShowBtn,
    isReshesh,
    refreshQrCode,
    opacityQRcode,
    refQrCode,
    isShowButton,
    setIsShowButton,
    dateFormat,
  } = props;

  // console.log("thai button", ticketDefinitions);

  if (
    !ticketDefinitions ||
    ticketDefinitions.length == 0 ||
    currentTicketDefinition === -1
  )
    return null;
  const ticketIsUsed = (item) => {
    return item?.status && item?.status !== "NONE";
  };
  const renderTiketItem = ({ item, index }) => {
    return (
      <View style={styles.viewItemTiketStyle}>
        <View style={styles.borderTiketStyle}>
          <View style={{ flex: 2 }}>
            {opacityQRcode == 1 ? (
              <CustomImageBackground style={styles.imgBackGround}>
                <Image
                  source={{ uri: getEventImage(event, true) }}
                  style={styles.imgBackGround}
                />
              </CustomImageBackground>
            ) : (
              <CustomImageBackground style={styles.imgBackGround}>
                <Grayscale>
                  <Image
                    source={{ uri: getEventImage(event, true) }}
                    style={styles.imgBackGround}
                  />
                </Grayscale>
              </CustomImageBackground>
            )}
          </View>

          <View style={{ flex: 5 }}>
            <Text
              numberOfLines={2}
              style={[styles.nameTiketStyle, { marginHorizontal: 15 }]}
            >
              {item.translatedName}
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.viewNumberStyle}>
              <ImageSvg.IcTicket width={22} height={18} />
              <Text style={styles.txtNumberItemStyle}>
                {item.tickets.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleChandeTicket = (index) => {
    if (
      currentTicketDefinition === -1 ||
      !ticketDefinitions ||
      ticketDefinitions.length == 0
    )
      return null;
    const data = ticketDefinitions[currentTicketDefinition].tickets;
    // if (ticketIsUsed(data[index])) {
    //   setIsShowButton(false);
    // } else {
    //   setIsShowButton(true);
    // }
    // console.log("dataa", data);
    ticketIsUsed(data[index]) ? setIsShowButton(false) : setIsShowButton(true);
    // console.log(ticketIsUsed(data[index]));
  };

  const renderTiketQrCode = ({ item, index }) => {
    const heightImage = deviceHeight * (isIphoneXorAbove() ? 0.54 : 0.8);
    let showTime = "";
    if (item.purchasedDate) {
      const timeformat = moment(item.purchasedDate).format("llll");
      const indexDot = timeformat.split(",");
      let arrTime = String(indexDot[2]);
      arrTime = arrTime.trim().split(" ");
      const dateFM = moment(item.purchasedDate).format(dateFormat);
      if (!is24Hour) {
        // showTime =
        //   indexDot[1] + ", " + arrTime[0] + " - " + arrTime[1] + arrTime[2];
        showTime = dateFM + " - " + arrTime[1] + arrTime[2];
      } else {
        let test = moment(item.purchasedDate).format("HH:mm");
        // showTime = indexDot[1] + ", " + arrTime[0] + " - " + test;
        showTime = dateFM + " - " + test;
      }
    }
    return (
      <View key={item._id}>
        <ImageBackground
          style={[
            {
              width: deviceWidth * 0.8 + 24,
              height: heightImage,
              resizeMode: "stretch",
              alignSelf: "center",
            },
          ]}
          resizeMode="stretch"
          source={ImageCustom.icBgEvent}
        >
          <View style={{ flex: 6 }}>
            <View style={[styles.viewQRcode]}>
              <Text style={styles.txtHeaderWRCode}>Show QR at entrance</Text>
            </View>

            <View style={styles.viewQRCodeStyle}>
              <View
                style={{ opacity: ticketIsUsed(item) ? 0.2 : opacityQRcode }}
              >
                <QRCode value={item.qrCode} size={heightImage * 0.4} />
              </View>

              {isReshesh && !ticketIsUsed(item) ? (
                <TouchableOpacity
                  onPress={() => refreshQrCode(item)}
                  style={{
                    flexDirection: "row",
                    marginTop: isIphoneXorAbove() ? 10 : 15,
                    marginBottom: 10,
                  }}
                >
                  <ImageSvg.IcRefresh width={22} height={18} />
                  <Text style={styles.txtRefreshStyle}>Refresh</Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.txtExpiredhStyle, { color: "#EB5757" }]}>
                  {ticketIsUsed(item) ? "Ticket used" : "Ticket expired"}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              flex: 3.5,
              paddingHorizontal: "12%",
              justifyContent: "center",
            }}
          >
            <View style={[styles.viewInfoStyle, {}]}>
              <Text style={styles.txtTitleInfoStyle}>Ticket ID:</Text>
              <View style={{ width: "75%", justifyContent: "flex-end" }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.txtContentInfoStyle,
                    { marginLeft: 5, textAlign: "right" },
                  ]}
                >
                  {item._id}
                </Text>
              </View>
            </View>

            <View style={[styles.viewInfoStyle, {}]}>
              <Text style={styles.txtTitleInfoStyle}>Hash:</Text>
              <View style={{ width: "80%", justifyContent: "flex-end" }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.txtContentInfoStyle,
                    { marginLeft: 5, textAlign: "right" },
                  ]}
                >
                  {item._id}
                </Text>
              </View>
            </View>

            <View style={styles.viewInfoStyle}>
              <Text style={styles.txtTitleInfoStyle}>Purchase date:</Text>
              <Text style={styles.txtContentInfoStyle}>{showTime}</Text>
            </View>
            <View style={[styles.viewInfoStyle, { marginVertical: 10 }]}>
              <Text style={styles.txtTitleInfoStyle}>Purchase price:</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircleIcons
                  name="logo-regular"
                  color="#FF6195"
                  size={{ width: 11, height: 12 }}
                />
                <Text
                  style={[
                    styles.txtTitleInfoStyle,
                    { color: "#FF6195", fontWeight: "bold" },
                  ]}
                >
                  {" "}
                  {fixDecimals(item.purchasedTokens)}{" "}
                </Text>
                <Text style={[styles.txtTitleInfoStyle, { color: "#000" }]}>
                  {" "}
                  €{" "}
                  {fixDecimals(
                    convertTokensToCurrency(
                      item.purchasedTokens,
                      conversionRate
                    )
                  )}{" "}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderCurrentQRCode = useMemo(() => {
    // console.log("thai data", ticketDefinitions);
    if (
      currentTicketDefinition === -1 ||
      !ticketDefinitions ||
      ticketDefinitions.length == 0
    )
      return null;
    const data = ticketDefinitions[currentTicketDefinition].tickets;

    ticketIsUsed(data[0]) ? setIsShowButton(false) : setIsShowButton(true);
    return (
      <Carousel
        ref={refQrCode}
        layout={"stack"}
        data={data}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth * 0.8 + 30}
        renderItem={renderTiketQrCode}
        onBeforeSnapToItem={handleChandeTicket}
      />
    );
  }, [ticketDefinitions, currentTicketDefinition]);

  const renderBtn = useMemo(() => {
    if (
      currentTicketDefinition === -1 ||
      !ticketDefinitions ||
      ticketDefinitions.length == 0 ||
      !isShowBtn
    )
      return null;
    const validTickets = ticketDefinitions
      .map((s) => s.tickets)
      .flat()
      .filter((s) => !s.status || s.status === "NONE");
    if (validTickets.length == 0) return;

    return (
      <View>
        <View style={styles.viewButtonStyle}>
          <TouchableOpacity
            onPress={nextTransferScreen}
            style={styles.buttonStyle}
          >
            <LinearGradient
              colors={["#B9F215", "#48A44A"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ImageSvg.IcLeftRight width={30} height={28} />
            </LinearGradient>
            <Text style={styles.txtRefreshStyle}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextSellTicket} style={styles.buttonStyle}>
            <LinearGradient
              colors={["#FF6195", "#C2426C"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ImageSvg.IconSell width={35} height={30} />
            </LinearGradient>
            <Text style={styles.txtRefreshStyle}>Sell</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [currentTicketDefinition]);

  const renderDetailTicket = useMemo(() => {
    if (
      currentTicketDefinition === -1 ||
      !ticketDefinitions ||
      ticketDefinitions.length == 0
    )
      return null;

    return (
      <View>
        {renderCurrentQRCode}
        {isShowButton && renderBtn}
        <View style={styles.viewDescriptionStyle}>
          <Text style={styles.titleDescriptionStyle}>Description</Text>
          <Text style={styles.contentDescriptionStyle}>{event.name}</Text>
        </View>
      </View>
    );
  }, [ticketDefinitions, currentTicketDefinition, isShowButton]);

  const renderContent = useMemo(() => {
    if (!ticketDefinitions) return;
    // console.log("thai dataaaaaa", ticketDefinitions);
    return (
      <ScrollView>
        <Carousel
          layout={"default"}
          data={ticketDefinitions}
          sliderWidth={deviceWidth}
          itemWidth={deviceWidth * 0.8}
          renderItem={renderTiketItem}
          removeClippedSubviews={false}
          onBeforeSnapToItem={onBeforeSnapChange}
        />
        {renderDetailTicket}
      </ScrollView>
    );
  }, [ticketDefinitions, currentTicketDefinition, is24Hour, isShowButton]);

  return <View style={[styles.containter, {}]}>{renderContent}</View>;
});

CarouselTiketDetailComponent.defaultProps = {
  opacityQRcode: 1,
  isReshesh: true,
  isShowBtn: true,
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imgBackGround: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
  },
  viewQRcode: {
    flex: 1.2,
    paddingTop: "6%",
    justifyContent: "center",
    width: deviceWidth * 0.8 - 13,
    marginLeft: 15,
  },
  txtHeaderWRCode: {
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center",
  },
  viewQRCodeStyle: {
    flex: 8,
    alignItems: "center",
    // justifyContent: 'center',
    //backgroundColor: 'green',
    paddingTop: "8%",
    marginBottom: 10,
  },
  txtRefreshStyle: {
    fontFamily: "Lato",
    fontSize: 14,
    marginLeft: 10,
  },
  txtExpiredhStyle: {
    fontFamily: "Lato",
    fontSize: 14,
    marginTop: 15,
  },
  viewInfoStyle: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: 'center',
  },
  txtTitleInfoStyle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
    fontFamily: "Lato",
  },
  txtContentInfoStyle: {
    fontSize: 14,
    fontFamily: "Lato",
    //paddingHorizontal: 20
  },
  linearGradientStyle: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "10%",
    marginBottom: 10,
  },
  viewButtonStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  viewDescriptionStyle: {
    marginTop: 20,
    width: deviceWidth * 0.85,
    alignSelf: "center",
    marginBottom: 20,
  },
  titleDescriptionStyle: {
    fontSize: 14,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  contentDescriptionStyle: {
    color: "#000",
    opacity: 0.7,
    fontSize: 16,
    fontFamily: "Lato",
    marginTop: 10,
    textAlign: "justify",
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 12,
  },

  viewItemTiketStyle: {
    height: 90,
    width: "100%",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    marginVertical: 20,
  },
  borderTiketStyle: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    paddingRight: 16,
    backgroundColor: "#fff",
    elevation: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    margin: 5,
  },

  viewNumberStyle: {
    flexDirection: "row",
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: "#EA5284",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  txtNumberItemStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
  },
});
