import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Platform,
  Animated,
  Dimensions,
  PermissionsAndroid,
  Linking,
  Share,
} from "react-native";
import EventDetailPrivateComponent from "../../components/Event/EventDetailPrivateComponent";
import NavigationService from "../../NavigationService";
import Geolocation from "@react-native-community/geolocation";
import {
  getchGetDetailEvent,
  getchGetDetailPrivateEvent,
  getEventAddress,
} from "../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import Clipboard from "@react-native-clipboard/clipboard";

const deviceHeight = Dimensions.get("window").height;
const HEADER_MAX_HEIGHT = deviceHeight * 0.35;
//Max Height of the Header
const HEADER_MIN_HEIGHT = 50;
//Min Height of the Header
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EventDetailPrivateScreen = (props) => {
  const { navigation, wallets } = props;

  const item = navigation.state.params.item;
  const [event, setEvent] = useState({ name: "", imageUrl: "" });

  const [is24Hour, setIs24Hour] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(-1);
  const [arrayTickets, setArrayTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSell, setTotalSell] = useState(0);
  const refCarousel = useRef(null);

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
    setIsLoading(true);
    getCurrentHourFormat();
    requestLocationPermission();
    getchGetDetailEvent(item._id, onCallBack);
    getchGetDetailPrivateEvent(item._id, item.seller, onCallBackTickets);
  }, []);

  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const onCallBackTickets = (response) => {
    setIsLoading(false);
    if (!response.error) {
      // group by sellerName and tokens
      let mapTicketsDefinition = {};
      response.forEach((s) => {
        let item = mapTicketsDefinition[s.ticketDefinition._id] ?? {
          translatedName: s.translatedName,
          translatedDescription: s.translatedDescription,
          sellerAvarta: s.sellerAvarta,
          sellerName: s.sellerName,
          tickets: {},
        };

        let ticket = item.tickets[s.tokens] ?? {
          seller: s.seller,
          ticketDefinitionId: s.ticketDefinition._id,
          tokens: s.tokens,
          tickets: [],
          numberBuy: 0,
        };
        ticket.tickets.push(s.issuerId);
        item.tickets[s.tokens] = ticket;
        mapTicketsDefinition[s.ticketDefinition._id] = item;
      });

      const tempMarketPlaceTickets = Object.entries(mapTicketsDefinition).map(
        ([key, value]) => value
      );
      // reset tickets here
      tempMarketPlaceTickets.forEach((s) => {
        const tickets = Object.entries(s.tickets).map(([key, value]) => value);
        s.tickets = tickets;
      });
      setArrayTickets(tempMarketPlaceTickets);
      setTotalSell(response.length);
      setCurrentTicket(0);
    }
  };

  const onCallBack = (data) => {
    if (!data.error) {
      setEvent(data.data);
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

    let location = getEventAddress(event, true);
    const latitude = event.location.latitude;
    const longitude = event.location.longitude;
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
    let dataTicket = [];
    let saleTickets = [];
    arrayTickets.forEach((item) => {
      saleTickets.push(item.tickets);
      dataTicket.push({
        translatedName: item.translatedName,
        translatedDescription: item.translatedDescription,
        numberBuy: 0,
        price: 0,
      });
    });

    NavigationService.navigate("CheckoutScreen", {
      dataTicket,
      itemEvent: event,
      saleTickets,
    });
  };

  const onBeforeSnapChange = (index) => {
    setCurrentImageIndex(index);
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const openAppleMap = () => {
    let location = getEventAddress(event, true);
    const latitude = event.location.latitude;
    const longitude = event.location.longitude;
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
    Linking.canOpenURL(urlLat).then((canOpen) => {
      if (canOpen) {
        // console.log("thai open google maps");
        // console.log("thai meo", location);
        Linking.openURL(urlLat);
      } else {
        console.log("open apple maps");
        const browser_url =
          "https://www.google.de/maps/@" +
          latitude +
          "," +
          longitude +
          "?q=" +
          location;
        console.log("browser_url ", browser_url);
        Linking.openURL(browser_url);
      }
    });
    onCloseModal();
  };

  const copyAddress = () => {
    let location = getEventAddress(event, true);
    Clipboard.setString(location);
    onCloseModal();
  };

  const onBeforeSnapChangeTickets = (index) => {
    setCurrentTicket(index);
  };

  const onPressMinus = (item, index, currentNumber) => {
    let newData = arrayTickets.slice();
    newData[currentTicket].tickets[index].numberBuy = currentNumber - 1;
    if (newData[currentTicket].tickets[index].numberBuy < 0)
      newData[currentTicket].tickets[index].numberBuy = 0;
    setArrayTickets(newData);
  };

  const onPressPlus = (item, index, currentNumber) => {
    let newData = arrayTickets.slice();
    newData[currentTicket].tickets[index].numberBuy = currentNumber + 1;
    setArrayTickets(newData);
  };

  return (
    <EventDetailPrivateComponent
      onBackPress={onBackPress}
      openMap={openMap}
      buyTicketFromEvent={buyTicketFromEvent}
      event={event}
      currentWallets={wallets.dataWallet[wallets.currentCardId]}
      conversionRate={wallets.conversionRate}
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
      titleTranslateY={titleTranslateY}
      imageTranslateY={imageTranslateY}
      imageOpacity={imageOpacity}
      headerTranslateY={headerTranslateY}
      scrollY={scrollY}
      onBeforeSnapChangeTickets={onBeforeSnapChangeTickets}
      currentTicket={currentTicket}
      arrayTickets={arrayTickets}
      isLoading={isLoading}
      totalSell={totalSell}
      onPressPlus={onPressPlus}
      onPressMinus={onPressMinus}
    />
  );
};

EventDetailPrivateScreen.navigationOptions = {
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
)(EventDetailPrivateScreen);
