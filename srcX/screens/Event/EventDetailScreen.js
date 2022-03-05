import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Platform,
  Animated,
  Dimensions,
  PermissionsAndroid,
  Linking,
  Share,
  NativeModules,
} from "react-native";
import EventDetailComponent from "../../components/Event/EventDetailComponent";
import NavigationService from "../../NavigationService";
import Geolocation from "@react-native-community/geolocation";
import {
  getPriceRangeInEvent,
  getchGetDetailEvent,
  getEventAddress,
} from "../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import Clipboard from "@react-native-clipboard/clipboard";
import { convertTokensToCurrency } from "../../halpers/utilities";
import Moment from "moment";
import { getDataKeystore } from "../../redux/actions/keyStore";

const deviceHeight = Dimensions.get("window").height;
const HEADER_MAX_HEIGHT = deviceHeight * 0.35;
//Max Height of the Header
const HEADER_MIN_HEIGHT = 50;
//Min Height of the Header
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EventDetailScreen = (props) => {
  const { navigation, wallets } = props;

  const eventId = navigation.state.params.eventId;
  let item = navigation.state.params.item;
  // console.log("eventId=====", eventId);
  // console.log("item=====", item);
  const isGay = navigation.state.params.isGay;

  const refScrollView = useRef(null);
  const [event, setEvent] = useState({ name: "", imageUrls: "", imageUrl: "" });
  const [priceMin, setPriceMin] = useState(0);
  const [is24Hour, setIs24Hour] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const refCarousel = useRef(null);
  const [dateFormat, setDateFormat] = useState("DD MMMM");
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: "clamp",
  });
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, -8],
    extrapolate: "clamp",
  });

  useEffect(() => {
    handleGetDateFormat();
    getCurrentHourFormat();
    requestLocationPermission();
    if (item) {
      setEvent(item);
      // console.log("event", item);
      getPriceRangeInEvent(item._id, onGetPriceCallBack);
    } else {
      getchGetDetailEvent(eventId, onEventDetailCallback);
    }
  }, []);

  const handleGetDateFormat = async () => {
    const formatDate = await getDataKeystore("@locale");
    if (formatDate) {
      setDateFormat(formatDate);
    }
  };

  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };
  const onEventDetailCallback = (response) => {
    if (!response.error) {
      setEvent(response.data);
      item = response.data;
      getPriceRangeInEvent(item._id, onGetPriceCallBack);
    }
  };

  const onGetPriceCallBack = (response) => {
    // console.log("thai res", response);
    let minPrice = 0;
    // find the min price
    if (
      response.success &&
      response.data.prices &&
      response.data.prices.length > 0
    ) {
      response.data.prices.forEach((s) => {
        if (!minPrice || minPrice > s.officialPrice) minPrice = s.officialPrice;
        if (s.marketPlace && s.marketPlace.minTokens) {
          let tokenInPrice = convertTokensToCurrency(
            s.marketPlace.minTokens,
            wallets.conversionRate
          );
          if (!minPrice || minPrice > tokenInPrice) minPrice = tokenInPrice;
        }
      });
    }

    if (minPrice) setPriceMin(minPrice);

    if (!response || response.data.isSoldOut) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const sentBar = () => {
    Geolocation.getCurrentPosition(
      (location) => {},
      (error) => {
        console.log(error);
      }
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          sentBar();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const openMap = async () => {
    if (Platform.OS == "ios") {
      setIsShowModal(true);
      return;
    }
    let itemEvent = item;
    if (event) {
      itemEvent = event;
    }
    let location = getEventAddress(itemEvent, true);
    const latitude = itemEvent.location.latitude;
    const longitude = itemEvent.location.longitude;
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = location;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  const buyTicketFromEvent = () => {
    let itemEvent = item;
    if (event) {
      itemEvent = event;
    }
    NavigationService.navigate("EventBuyScreen", { itemEvent });
  };

  const onBeforeSnapChange = (index) => {
    setCurrentImageIndex(index);
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const openAppleMap = () => {
    let itemEvent = item;
    if (event) {
      itemEvent = event;
    }
    let location = getEventAddress(itemEvent, true);
    const latitude = itemEvent.location.latitude;
    const longitude = itemEvent.location.longitude;
    const scheme = "maps:0,0?q=";
    const latLng = `${latitude},${longitude}`;
    const label = location;
    onCloseModal();
    Linking.openURL(`${scheme}${label}@${latLng}`);
  };

  const openGoogleMap = () => {
    let itemEvent = item;
    if (event) {
      itemEvent = event;
    }
    let location = getEventAddress(itemEvent, true);
    const latitude = itemEvent.location.latitude;
    const longitude = itemEvent.location.longitude;
    let url = `comgooglemaps://?q=${location}&center=${latitude},${longitude}&zoom=14&views=traffic`;
    // console.log("thai meo", location);
    const urlLat = Platform.select({
      ios: "maps:" + latitude + "," + longitude + "?q=" + location,
      android: "geo:" + latitude + "," + longitude + "?q=" + location,
    });
    //------------
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${latitude},${longitude}`;
    const label = location;
    const newUrl = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    // console.log(newUrl);
    Linking.canOpenURL(url).then((canOpen) => {
      if (canOpen) {
        console.log("thai open google maps");
        // console.log("thai meo", location);
        // Linking.openURL(url);
        Linking.openURL(newUrl);
      } else {
        const browser_url =
          "https://www.google.de/maps/@" +
          latitude +
          "," +
          longitude +
          "?q=" +
          location;
        Linking.openURL(browser_url);
      }
    });
    onCloseModal();
  };

  const copyAddress = () => {
    let itemEvent = item;
    if (event) {
      itemEvent = event;
    }
    let location = getEventAddress(itemEvent, true);
    Clipboard.setString(location);
    onCloseModal();
  };

  return (
    <EventDetailComponent
      onBackPress={onBackPress}
      openMap={openMap}
      buyTicketFromEvent={buyTicketFromEvent}
      refScrollView={refScrollView}
      item={event}
      currentWallets={wallets.dataWallet[wallets.currentCardId]}
      conversionRate={wallets.conversionRate}
      priceMin={priceMin}
      is24Hour={is24Hour}
      currentImageIndex={currentImageIndex}
      setCurrentImageIndex={setCurrentImageIndex}
      onBeforeSnapChange={onBeforeSnapChange}
      refCarousel={refCarousel}
      isShowModal={isShowModal}
      onCloseModal={onCloseModal}
      openAppleMap={openAppleMap}
      openGoogleMap={openGoogleMap}
      copyAddress={copyAddress}
      isDisable={isDisable}
      isGay={isGay}
      titleTranslateY={titleTranslateY}
      imageTranslateY={imageTranslateY}
      imageOpacity={imageOpacity}
      headerTranslateY={headerTranslateY}
      scrollY={scrollY}
      dateFormat={dateFormat}
    />
  );
};

EventDetailScreen.navigationOptions = {
  title: "",
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

const mapDispatchToProps = (dispatch) => ({
  //setCountryCode: payload => dispatch(setCountryCode(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailScreen);
