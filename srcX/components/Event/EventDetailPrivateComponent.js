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
  Animated,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import * as ImageSvg from "../Icons/CircleIcons/ImageSvg";
import { Icon } from "react-native-elements";
import moment from "moment";
import Carousel, {
  ParallaxImage,
  Pagination,
} from "react-native-snap-carousel";
import CustomImageBackground from "../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import * as ImageCustom from "../Icons/CircleIcons/index";
import CircleIcons from "../Icons/CircleIcons";
import { Section } from "../Layout";
import MapView, { Marker } from "react-native-maps";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import ViewMoreText from "react-native-view-more-text";
import Modal from "react-native-modal";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";
import { Avatar } from "react-native-elements";
import defaultAvatar from "../../../assets/images/avatar.png";
import { getEventAddress } from "../../redux/actions/index";
import { getEventImage } from "../../halpers/utilities";

var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
// const HEADER_MAX_HEIGHT = deviceHeight * 0.35;
const HEADER_MAX_HEIGHT = deviceWidth / (375 / 210) + 5;
//Max Height of the Header
const HEADER_MIN_HEIGHT = 90;
//Min Height of the Header
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const isAndroid = Platform.OS == "android";

export default (EventDetailPrivateComponent = (props) => {
  const {
    navigation,
    onBackPress,
    isShowMore,
    currentImageIndex,
    isShowModal,
    onCloseModal,
    openMap,
    buyTicketFromEvent,

    event,
    refCarousel,
    is24Hour,
    conversionRate,
    onBeforeSnapChange,
    openAppleMap,
    openGoogleMap,
    copyAddress,
    isDisable,

    titleTranslateY,
    imageTranslateY,
    imageOpacity,
    headerTranslateY,
    scrollY,

    arrayTickets,
    currentTicket,
    onBeforeSnapChangeTickets,
    isLoading,
    totalSell,
    onPressMinus,
    onPressPlus,
  } = props;

  const renderImage = useCallback(
    ({ item, index }) => {
      return renderImageItem(item);
    },
    [currentImageIndex]
  );

  const renderImageItem = useCallback((item) => {
    return (
      <CustomImageBackground style={styles.imageEventStyle}>
        <Image source={{ uri: item }} style={styles.imageEventStyle} />
      </CustomImageBackground>
    );
  }, []);

  const pagination = () => {
    if (!event || (!event.imageUrls && !event.imageUrl)) return null;
    const length =
      event.imageUrls && event.imageUrls.length > 0
        ? event.imageUrls.length
        : event.imageUrl
        ? 1
        : 0;
    return (
      <Pagination
        dotsLength={length}
        activeDotIndex={currentImageIndex}
        containerStyle={styles.containerDot}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{ width: 10, height: 10 }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.9}
        inactiveDotColor="#fff"
        dotColor="#FF6195"
      />
    );
  };

  const renderImageCarousel = useMemo(() => {
    if (!event) return;
    const data =
      event.imageUrls && event.imageUrls.length > 0
        ? event.imageUrls
        : [event.imageUrl];
    return (
      <Carousel
        ref={refCarousel}
        layout={"default"}
        data={data}
        sliderWidth={deviceWidth}
        itemWidth={deviceWidth}
        renderItem={renderImage}
        removeClippedSubviews={false}
        useScrollView={true}
        onSnapToItem={onBeforeSnapChange}
        loop={true}
        autoplay={true}
        loopClonesPerSide={1}
        slideStyle={{ width: deviceWidth }}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
      />
    );
  }, [event, currentImageIndex]);

  const renderHeader = useMemo(() => {
    return (
      <View>
        {renderImageCarousel}
        {pagination()}
        <TouchableOpacity style={styles.iconBackStyle} onPress={onBackPress}>
          <Icon name="arrowleft" type="antdesign" size={20} />
        </TouchableOpacity>
      </View>
    );
  }, [event, currentImageIndex]);

  const renderTimeView = (item) => {
    return (
      <View style={styles.viewDateStyle}>
        <Text style={[styles.txtDayStyle, { opacity: 0.8 }]}>
          {returnTime(item.startDate, true, item.endDate)}
        </Text>
      </View>
    );
  };

  const returnTime = (date, isOneDay = false, dateEnd) => {
    const timeformat = moment(date).format("llll");
    let indexDot = timeformat.split(",");
    let arrTime = String(indexDot[2]);
    arrTime = arrTime.trim().split(" ");

    const timeStart = timeformat;
    const numberDay = moment(date).day();

    let indexDotStart = timeStart.split(",");
    let arrTimeStart = String(indexDotStart[2]);
    arrTimeStart = arrTimeStart.trim().split(" ");

    const timeEnd = moment(isOneDay ? dateEnd : date).format("llll");
    indexDot = timeEnd.split(",");
    let arrTimeEnd = String(indexDot[2]);
    arrTimeEnd = arrTimeEnd.trim().split(" ");

    let showTimeStart = "";
    let showTimeEnd = "";

    if (!is24Hour) {
      showTimeStart = arrTimeStart[1] + " " + arrTimeStart[2];
      showTimeEnd = arrTimeEnd[1] + " " + arrTimeEnd[2];
    } else {
      showTimeStart = moment(date).format("HH:mm");
      showTimeEnd = moment(isOneDay ? dateEnd : date).format("HH:mm");
    }
    if (isOneDay)
      return (
        days[numberDay] +
        "," +
        indexDotStart[1] +
        ", " +
        arrTime[0] +
        " " +
        showTimeStart +
        " - " +
        showTimeEnd
      );
    return (
      days[numberDay] +
      "," +
      indexDotStart[1] +
      ", " +
      arrTime[0] +
      " " +
      showTimeStart
    );
  };

  const renderDayView = (item) => {
    return (
      <View style={styles.viewDateStyle}>
        <Text style={[styles.txtDayStyle, { opacity: 0.8 }]}>
          {returnTime(item.startDate)}
        </Text>
        <Text style={[styles.txtDayStyle, { opacity: 0.8 }]}>
          until {returnTime(item.endDate)}
        </Text>
      </View>
    );
  };

  const renderDetailEvent = useMemo(() => {
    if (!event) return null;

    let isOneDay = true;
    const startDate = moment(event.startDate).format("YYYY-MM-DD");
    const endDate = moment(event.endDate).format("YYYY-MM-DD");

    if (startDate != endDate) {
      isOneDay = false;
    }
    let nameEvent = event.name;
    let location = getEventAddress(event, true);

    return (
      <View style={{ backgroundColor: "#fff", marginBottom: 10 }}>
        <View style={styles.contentEventStyle}>
          <Image source={ImageCustom.icCalendar} style={styles.icStyle} />
          {isOneDay ? renderTimeView(event) : renderDayView(event)}
        </View>

        <View style={styles.contentEventStyle}>
          <Image
            source={ImageCustom.icLocation}
            style={[
              styles.icStyle,
              { height: 25, width: 25, tintColor: "#EA5284" },
            ]}
          />
          <View style={styles.viewDateStyle}>
            {event.address2 > 0 && (
              <Text style={[styles.txtDayStyle, { opacity: 0.8 }]}>
                {event.address2}
              </Text>
            )}
            <Text
              numberOfLines={2}
              style={[
                styles.txtDayStyle,
                { color: "rgba(0, 0, 0, 0.4)", marginRight: 15 },
              ]}
            >
              {location}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [event, is24Hour]);

  const renderViewMore = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.txtMoreStyle}>
        Read more
      </Text>
    );
  };

  const renderViewLess = (onPress) => {
    return (
      <Text onPress={onPress} style={styles.txtMoreStyle}>
        Hide
      </Text>
    );
  };

  const renderDetail = useMemo(() => {
    if (!event) return null;
    return (
      <View
        style={[
          styles.aboutStyle,
          styles.shadownStyle,
          { paddingHorizontal: 15 },
        ]}
      >
        {/*  */}
        <Text
          style={[
            styles.txtTileEvetnStyle,
            { fontSize: 16, marginTop: 15, marginBottom: 5 },
          ]}
        >
          About
        </Text>

        <ViewMoreText
          numberOfLines={3}
          renderViewMore={renderViewMore}
          renderViewLess={renderViewLess}
          textStyle={[styles.txtContentStyle, {}]}
        >
          <Text style={[styles.txtContentStyle, {}]}>
            {event.description || ""}
          </Text>
        </ViewMoreText>
      </View>
    );
  }, [event]);

  const renderMap = useMemo(() => {
    if (!event || !event.location) return null;

    const latitude = event.location.latitude || 0;
    const longitude = event.location.longitude || 0;

    let location = getEventAddress(event, true);

    let nameEvent = event.name;

    return (
      <View style={[styles.aboutStyle, styles.shadownStyle]}>
        <Text
          style={[
            styles.txtTileEvetnStyle,
            { fontSize: 16, marginTop: 15, marginLeft: 16 },
          ]}
        >
          Location
        </Text>
        <View style={styles.helpContainer}>
          <MapView
            style={{
              flex: 1,
              height: 165,
              marginTop: 15,
              marginBottom: 15,
            }}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0012,
              longitudeDelta: 0.0001,
              scrollEnabled: false,
            }}
          >
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              centerOffset={{ x: 0, y: -35 }}
            >
              <ImageBackground
                source={ImageCustom.icMapPinDefault}
                style={{ width: 54, height: 70 }}
              >
                <Image
                  source={{
                    uri: getEventImage(event, true),
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40 / 2,
                    backgroundColor: "white",
                    alignSelf: "center",
                    marginTop: 5,
                  }}
                />
              </ImageBackground>
            </Marker>
          </MapView>
          {nameEvent.length > 0 && (
            <Text style={{ fontSize: 16, marginLeft: 16 }}>{nameEvent}</Text>
          )}
          <Text
            style={{
              fontSize: 16,
              color: "rgba(0, 0, 0, 0.4)",
              marginLeft: 16,
              marginVertical: 10,
            }}
          >
            {location}
          </Text>
          <Text
            onPress={openMap}
            style={{
              fontSize: 16,
              color: "#EA5284",
              marginLeft: 16,
              marginBottom: 10,
            }}
          >
            Get directions
          </Text>
        </View>
      </View>
    );
  }, [event]);

  const renderModalMap = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isShowModal}
        onBackdropPress={onCloseModal}
        onBackButtonPress={onCloseModal}
      >
        <SafeAreaView style={styles.viewBottomView}>
          <View style={styles.viewBtnModalStyle}>
            <TouchableOpacity style={styles.btnStyle} onPress={openAppleMap}>
              <Text style={styles.txtStyle}>Open in Apple Maps</Text>
            </TouchableOpacity>
            <View style={styles.viewLineStyle} />
            <TouchableOpacity onPress={openGoogleMap} style={styles.btnStyle}>
              <Text style={styles.txtStyle}>Open in Google Maps</Text>
            </TouchableOpacity>
            <View style={styles.viewLineStyle} />
            <TouchableOpacity onPress={copyAddress} style={styles.btnStyle}>
              <Text style={styles.txtStyle}>Copy address</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onCloseModal}
            style={[styles.viewBtnCancelStyle, {}]}
          >
            <Text style={styles.txtBoldStyle}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }, [isShowModal]);

  const renderButton = useMemo(() => {
    if (!arrayTickets || currentTicket == -1 || arrayTickets.length == 0) {
      return (
        <View style={[styles.viewBtnStyle, styles.shadownStyle]}>
          <View
            colors={["rgba(0, 0, 0, 0.2)"]}
            style={[
              styles.linearGradientStyle,
              { backgroundColor: "rgba(0, 0, 0, 0.2)" },
            ]}
          >
            <Text style={[styles.txtGetTikesStyle, { paddingVertical: 5 }]}>
              SOLD OUT
            </Text>
            {/* <Text style={styles.txtPriceTitlewStyle}>No ticket available for sale on EventX</Text> */}
          </View>
        </View>
      );
    }

    let sum = 0;
    let price = 0;
    for (let i = 0; i < arrayTickets.length; ++i) {
      for (let j = 0; j < arrayTickets[i].tickets.length; j++) {
        sum += arrayTickets[i].tickets[j].numberBuy;
        price +=
          arrayTickets[i].tickets[j].numberBuy *
          arrayTickets[i].tickets[j].tokens;
      }
    }
    return (
      <TouchableOpacity
        onPress={buyTicketFromEvent}
        style={[styles.viewBtnStyle, styles.shadownStyle]}
      >
        <LinearGradient
          colors={["#FF6195", "#C2426C"]}
          style={styles.linearGradientNextStyle}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.rowStyle}>
              <ImageSvg.IcTicket width={22} height={18} />
              <Text style={styles.txtNumberTicketStyle}>{sum}</Text>
            </View>

            <View style={[styles.rowStyle, { justifyContent: "flex-start" }]}>
              <CircleIcons
                name="logo-regular"
                color="#fff"
                size={{ width: 11, height: 12 }}
              />
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { color: "#fff", fontWeight: "bold" },
                ]}
              >
                {" "}
                {fixDecimals(price)}
              </Text>
            </View>
          </View>

          <View style={styles.rowStyle}>
            <Text style={styles.txtNumberTicketStyle}>checkout</Text>
            <Icon name="arrowright" type="antdesign" color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [arrayTickets, currentTicket]);

  const renderViewMoreTicket = (onPress) => (
    <Text onPress={onPress} style={styles.txtMoreStyle}>
      More Details
    </Text>
  );

  const renderTicketDefinition = ({ item, index }) => {
    return (
      <View style={styles.viewItemTiketStyle}>
        <View style={styles.borderTiketStyle}>
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              source={{ uri: getEventImage(event, true) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>
          <Text
            numberOfLines={2}
            style={[styles.nameTiketStyle, { marginLeft: 15 }]}
          >
            {item.translatedName}
          </Text>
        </View>
      </View>
    );
  };

  const renderDetailTickets = useMemo(() => {
    if (!arrayTickets || currentTicket == -1 || arrayTickets.length == 0)
      return;
    const descriptionTicket = arrayTickets[currentTicket].translatedDescription;
    if (!descriptionTicket || descriptionTicket.trim().length == 0) return;
    return (
      <View style={[styles.aboutStyle, { paddingHorizontal: 15 }]}>
        <ViewMoreText
          numberOfLines={3}
          renderViewMore={renderViewMoreTicket}
          renderViewLess={renderViewLess}
          textStyle={[styles.txtContentStyle, {}]}
        >
          <Text>{descriptionTicket}</Text>
        </ViewMoreText>
      </View>
    );
  }, [arrayTickets, currentTicket]);

  const renderTicketItem = ({ item, index }) => {
    const total = item.tickets.length;
    return (
      <View style={[styles.ticketItemStyle]}>
        <View>
          <View style={[styles.rowStyle, { justifyContent: "flex-start" }]}>
            <CircleIcons
              name="logo-regular"
              color="#FF6195"
              size={{ width: 11, height: 12 }}
            />
            <Text
              style={[
                styles.txtTitleItemZero,
                { color: "#FF6195", fontWeight: "bold" },
              ]}
            >
              {" "}
              {fixDecimals(item.tokens)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                €{" "}
                {fixDecimals(
                  convertTokensToCurrency(item.tokens, conversionRate)
                )}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.rowStyle}>
          <TouchableOpacity
            onPress={() => onPressMinus(item, index, item.numberBuy)}
            disabled={item.numberBuy == 0}
          >
            <Image source={ImageCustom.icMinus} style={styles.iconMinusStyle} />
          </TouchableOpacity>

          <Text style={styles.txtNumberStyle}>
            {item.numberBuy}
            <Text style={[styles.txtNumberSumStyle, { fontWeight: "normal" }]}>
              /{total}
            </Text>
          </Text>

          <TouchableOpacity
            disabled={item.numberBuy == total}
            onPress={() => onPressPlus(item, index, item.numberBuy)}
          >
            <Image
              source={ImageCustom.icPlusNumber}
              style={[styles.iconMinusStyle, { tintColor: "#EA5284" }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItemKey = (item, index) => String(index);

  const renderSellingTicket = useMemo(() => {
    if (!arrayTickets || currentTicket == -1 || arrayTickets.length == 0)
      return;
    const data = arrayTickets[currentTicket].tickets;
    return (
      <Section
        customStyle={{ paddingBottom: 0 }}
        title={"offered by " + arrayTickets[currentTicket].sellerName}
      >
        <FlatList
          data={data}
          renderItem={renderTicketItem}
          keyExtractor={renderItemKey}
        />
      </Section>
    );
  }, [arrayTickets, currentTicket]);

  const renderTicket = useMemo(() => {
    if (!arrayTickets || currentTicket == -1 || arrayTickets.length == 0)
      return;
    const data = arrayTickets[currentTicket];
    const profileImg =
      data.sellerAvarta && !data.sellerAvarta.includes("dummy-profile-pic.png")
        ? { uri: data.sellerAvarta }
        : defaultAvatar;

    return (
      <View>
        <View style={styles.viewProfileStyle}>
          <Avatar rounded size={64} source={profileImg} />
          <Text style={styles.txtTickets}>
            {totalSell} {totalSell == 1 ? "ticket" : "tickets"} offered by{" "}
            {data.sellerName}
          </Text>
        </View>
        <Carousel
          layout={"default"}
          data={arrayTickets}
          sliderWidth={deviceWidth}
          itemWidth={deviceWidth * 0.8}
          renderItem={renderTicketDefinition}
          removeClippedSubviews={false}
          useScrollView={true}
          onBeforeSnapToItem={onBeforeSnapChangeTickets}
        />
        {renderDetailTickets}
        {renderSellingTicket}
      </View>
    );
  }, [arrayTickets, currentTicket]);

  const renderLoading = useMemo(() => {
    if (!isLoading) return;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT - 32 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <Text
            numberOfLines={3}
            style={[
              styles.txtTileEvetnHederStyle,
              { marginTop: isAndroid ? 20 : 10 },
            ]}
          >
            {event ? event.name : ""}
          </Text>
          {renderDetailEvent}
          {renderDetail}
          {renderMap}
          {renderTicket}
          {renderButton}
        </Animated.ScrollView>
        {renderModalMap}

        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <Animated.View
            style={[
              styles.headerBackground,
              {
                opacity: imageOpacity,
                transform: [{ translateY: imageTranslateY }],
              },
            ]}
            source={ImageCustom.defaulImage}
          >
            {renderHeader}
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.topBar,
            {
              transform: [{ translateY: titleTranslateY }],
              opacity: scrollY.interpolate({
                inputRange: [
                  0,
                  HEADER_SCROLL_DISTANCE / 2,
                  HEADER_SCROLL_DISTANCE,
                ],
                outputRange: [0, 0.5, 1],
              }),
            },
          ]}
        >
          <TouchableOpacity
            style={{
              padding: isIphoneXorAbove() ? 5 : 5,
              // backgroundColor: "red",
              bottom: isIphoneXorAbove() ? 0 : Platform.OS == "android" ? 0 : 8,
              // top: Platform.OS == "android" ? 0 : 0,
              top: Platform.OS == "android" ? 2 : isIphoneXorAbove() ? -3 : -7,
              paddingHorizontal: 10,
              paddingTop: 8,
            }}
            onPress={onBackPress}
          >
            <Icon name="arrowleft" type="antdesign" />
          </TouchableOpacity>
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            {event ? event.name : ""}
          </Text>
          <View style={{ width: 26 }} />
        </Animated.View>
        {renderLoading}
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeAreaViewStyle: {
    flex: 1,
    //paddingTop: isIphoneXorAbove() ? '10%' : 0
  },
  viewHeaderStyle: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 56,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBackStyle: {
    // position: "absolute",
    // left: 15,
    // top: isIphoneXorAbove() ? "5%" : "10%",
    // // isIphoneXorAbove() ? 32 : 0,
    // height: 35,
    // width: 35,
    // borderRadius: 20,
    // backgroundColor: "#ebeaef",
    // justifyContent: "center",
    // alignItems: "center",
    position: "absolute",
    left: 15,
    // top: isIphoneXorAbove() ? "5%" : "15%",
    top: isIphoneXorAbove() ? "7%" : isAndroid ? "6%" : "14%",
    // isIphoneXorAbove() ? 32 : 0,
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#ebeaef",
    justifyContent: "center",
    alignItems: "center",
  },
  imageEventStyle: {
    width: deviceWidth,
    // height: deviceHeight * 0.35,
    // height: 210,
    height: deviceWidth / (375 / 210),
    resizeMode: "stretch",
  },
  txtTileEvetnStyle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textTransform: "uppercase",
    fontFamily: "Lato",
  },
  txtTileEvetnHederStyle: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Lato",
    paddingHorizontal: 15,
    paddingTop: 25,
    backgroundColor: "#fff",
    marginTop: Platform.OS == "ios" ? 10 : 10,
  },
  contentEventStyle: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 15,
  },
  icStyle: {
    marginTop: 8,
    height: 20,
    width: 25,
    resizeMode: "contain",
  },
  viewDateStyle: {
    marginHorizontal: 15,
  },
  txtDayStyle: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
    fontFamily: "Lato",
  },
  aboutStyle: {
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 10,
    //paddingHorizontal: 15
  },
  txtMoreStyle: {
    color: "#EA5284",
    fontSize: 16,
    marginBottom: 15,
    fontFamily: "Lato",
    marginTop: 15,
  },
  linearGradientStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
    width: "90%",
    borderRadius: 4,
    alignSelf: "center",
  },
  linearGradientNextStyle: {
    flexDirection: "row",
    width: "90%",
    height: 55,
    alignSelf: "center",
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  txtGetTikesStyle: {
    fontSize: 16,
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "Lato",
  },
  txtPriceTitlewStyle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.5,
    fontFamily: "Lato",
  },
  helpContainer: {
    // paddingRight: 15,
    // paddingLeft: 15,
    justifyContent: "center",
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    elevation: 15,
    marginTop: 10,
    paddingVertical: 5,
  },
  txtContentStyle: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
    // fontFamily: "Lato",
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dotStyle: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: -2,
    backgroundColor: "#FF6195",
  },
  containerDot: {
    position: "relative",
    marginTop: -50,
  },
  viewBtnModalStyle: {
    backgroundColor: "#c4c4c4",
    width: deviceWidth * 0.95,
    borderRadius: 8,
  },
  viewBtnCancelStyle: {
    width: deviceWidth * 0.95,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  btnStyle: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  txtStyle: {
    fontSize: 17,
    color: "#3982d3",
    fontFamily: "Lato",
  },
  txtBoldStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3982d3",
    fontFamily: "Lato",
  },
  containeModalStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  viewLineStyle: {
    backgroundColor: "rgba(0, 0, 0, .3)",
    height: 1,
    width: "100%",
  },
  viewBottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeaderStyle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    maxWidth: "80%",
    fontFamily: "Lato",
    textTransform: "uppercase",
    marginTop: isIphoneXorAbove() ? 6 : Platform.OS == "ios" ? 6 : 0,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#402583",
    backgroundColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 1,
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    position: "absolute",
    top: isIphoneXorAbove() ? 32 : 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    overflow: "hidden",
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  topBar: {
    // height: isAndroid ? 56 : isIphoneXorAbove() ? 78 : 65,
    height: isAndroid ? 60 : isIphoneXorAbove() ? 85 : 70,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: isAndroid ? 0 : isIphoneXorAbove() ? 50 : 38,
    alignItems: isAndroid ? "center" : "flex-start",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  txtNumberTicketStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 16,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: 15,
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
  imgBackGround: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: "25%",
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
  viewProfileStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  txtTickets: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Lato",
    marginTop: 10,
    textTransform: "uppercase",
  },
  txtTitleItemZero: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Lato",
  },
  ticketItemStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    borderBottomWidth: 1,
  },
  iconMinusStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    //opacity: 0.3
  },
  txtNumberStyle: {
    fontSize: 22,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  txtNumberSumStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
});
