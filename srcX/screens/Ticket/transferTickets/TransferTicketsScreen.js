import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import TransferTicketsComponent from "../../../components/Ticket/TransferTickets/TransferTicketsComponent";
import NavigationService from "../../../NavigationService";
import { getDataKeystore } from "../../../redux/actions/keyStore";
import {
  getEvtxContacts,
  transferTickets,
  getAvailableTickets,
  getOwnTickets,
} from "../../../redux/actions/index";
import Contacts from "react-native-contacts";
import { PermissionsAndroid, Alert, Platform, Linking } from "react-native";

const TransferTicketsScreen = (props) => {
  const {
    getEvtxContacts,
    profile,
    evtxContactsProps,
    wallets,
    navigation,
  } = props;

  //const dataTicket = props.navigation?.state?.params.dataTicket;
  let dataTicket = [];
  //const [dataTicket, setDataTicket] = useState(null);
  const event = props.navigation?.state?.params.event;
  console.log("Event===", event);
  const [dataContact, setDataContact] = useState([]);
  const [dataAllContact, setAllDataContact] = useState([]);
  const [valueSearch, setSearchedValue] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const refCarousel = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    getOwnTickets(event._id, callBackTicket);
  }, []);

  const callBackTicket = (response) => {
    if (response.Error) {
      Alert.alert(
        "Warning!",
        response.Error,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      dataTicket = response;
      const ticketIds = response
        .map((s) => s.tickets)
        .flat()
        .map((s) => s._id);
      getAvailableTickets(ticketIds, onAvailableTicketsCallback);
    }
  };

  const onAvailableTicketsCallback = (response) => {
    setIsLoading(false);
    const ticketIds = dataTicket
      .map((s) => s.tickets)
      .flat()
      .map((s) => s._id);
    let availableTicketIds = ticketIds;
    if (response.success) {
      availableTicketIds = response.data.map((s) => s._id);
    }
    let tickets = [];
    for (let i = 0; i < dataTicket.length; ++i) {
      // ignore all tickets is checked-in
      dataTicket[i].tickets = dataTicket[i].tickets.filter((s) =>
        availableTicketIds.includes(s._id)
      );
      let item = { ...dataTicket[i], numberBuy: 0 };
      tickets.push(item);
    }
    setTickets(tickets);
  };

  useEffect(() => {
    checkCacheContact();
  }, []);

  const checkCacheContact = async () => {
    if (Platform.OS === "ios") {
      checkMultiPermissionsIos();
    }
    if (Platform.OS === "android") {
      checkMultiPermissionsAndroid();
    }
  };

  function checkMultiPermissionsIos() {
    Contacts.checkPermission((err, permission) => {
      if (err) throw err;
      if (permission === "undefined") {
        Contacts.requestPermission((err, perm) => {
          loadContactsAfterPermission(perm);
        });
      }
      loadContactsAfterPermission(permission);
    });
  }

  function checkMultiPermissionsAndroid() {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      }).then((granted) => {
        if (granted != PermissionsAndroid.RESULTS.GRANTED) {
          setIsLoading(false);
          return;
        }

        Contacts.getAll((err, contactsList) => {
          //const contacts = contactsList.filter(item => checkOwnPhoneNumber(item));
          if (err === "denied") {
            Bugfender.e(
              "evtx-contacts",
              `ContactsScreen checkPermission Android permission Authorized but error denied=${JSON.stringify(
                err
              )}`
            );
            Alert.alert(
              "Warning!",
              "You have not enabled contacts permissions",
              [
                {
                  text: "Try again",
                  onPress: () => checkMultiPermissionsAndroid(),
                },
                { text: "OK", onPress: () => setPermission(true) },
              ],

              { cancelable: false }
            );
          } else {
            getContactLocal(contactsList);
          }
        });
      });
    } catch (error) {}
  }

  function loadContactsAfterPermission(permission) {
    if (permission === "authorized") {
      Contacts.getAll((err, contactsList) => {
        if (err === "denied") {
          Alert.alert(
            "Warning!",
            "Not able to read contacts from App",
            [{ text: "Try again", onPress: () => checkMultiPermissionsIos() }],
            [{ text: "Ok", onPress: () => setPermission(true) }],
            { cancelable: false }
          );
        } else {
          getContactLocal(contactsList);
        }
      });
    }
    if (permission === "denied") {
      Alert.alert(
        "Warning!",
        "You have not enabled contacts permissions",
        [
          { text: "OK", onPress: () => setPermission(true) },
          { text: "Enable", onPress: () => Linking.openURL("app-settings:") },
        ],
        { cancelable: false }
      );
    }
  }

  const getContactLocal = (contactsList) => {
    const contacts = contactsList.filter((item) => checkOwnPhoneNumber(item));
    let conFilter = [];
    for (let i = 0; i < contacts.length; ++i) {
      const item = contacts[i];
      const regex = /[ ()-]/gi;
      let number = item.phoneNumbers
        ? item.phoneNumbers[0]
          ? item.phoneNumbers[0].number.replace(regex, "")
          : null
        : null;
      if (!number || number.length < 10 || number.length > 15) {
        continue;
      } else {
        const fullName = `${item.givenName} ${item.familyName}`;
        conFilter.push({
          ...item,
          value: fullName,
          key: item.phoneNumbers[0].number,
        });
      }
    }
    evtxContacts(conFilter);
  };

  const evtxContacts = (contacts) => {
    getEvtxContacts(contacts);
  };

  const checkOwnPhoneNumber = (item) => {
    let number = item.phoneNumbers
      ? item.phoneNumbers[0]
        ? item.phoneNumbers[0].number
        : null
      : null;
    number = number?.replace(/[ ()-]/gi, "");
    return !profile?.phoneNumber?.includes(number);
  };

  useEffect(() => {
    let newData = [];
    for (let i = 0; i < evtxContactsProps.length; ++i) {
      const item = evtxContactsProps[i];
      const isCheck = checkOwnPhoneNumber(item);
      if (isCheck) {
        newData.push({ ...item, isCheck: false });
      }
    }
    setDataContact(newData);
    setAllDataContact(newData);
  }, [evtxContactsProps]);

  const onBackPress = () => {
    NavigationService.goBack();
  };

  const nextActiveSlide = () => {
    setActiveSlide(2);
    refCarousel.current && refCarousel.current.snapToNext();
  };

  const nextActiveSlideFirt = () => {
    setActiveSlide(1);
    refCarousel.current && refCarousel.current.snapToNext();
  };

  const onSwipeLeft = (number) => {
    if (number == 0) {
      refCarousel.current && refCarousel.current.snapToItem(number);
    } else {
      refCarousel.current && refCarousel.current.snapToPrev();
    }

    setActiveSlide(number);
  };

  const onTransferClick = (newDataTicket, dataContactSelected) => {
    setIsLoading(true);
    let issuerIds = [];

    newDataTicket.forEach((t) => {
      for (let i = 0; i < t.tickets.length && i < t.numberBuy; i++) {
        issuerIds.push(t.tickets[i].issuerId);
      }
    });

    transferTickets(issuerIds, dataContactSelected[0].id, onCallBackTransfer);
  };

  const onCallBackTransfer = (response) => {
    console.log("");
    if (response.success) {
      NavigationService.navigate("TransferTicketsSuccessScreen");
    } else {
      showAlert("Warning", response.data.Error);
    }
    setIsLoading(false);
  };

  const showAlert = (title, content) => {
    Alert.alert(
      title,
      content,
      [
        {
          text: "OK",
          onPress: () => {
            navigation.pop(3);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onPressCheck = (item, index) => {
    let newData = [...dataContact];
    newData = newData.map((item) => {
      return { ...item, isCheck: false };
    });
    newData[index] = {
      ...newData[index],
      isCheck: !newData[index].isCheck,
    };
    setDataContact(newData);
  };

  const searchContact = (txt) => {
    setSearchedValue(txt);
    searchFilterFunction(txt);
  };

  function searchFilterFunction(text) {
    const textSearch = text.trimLeft();
    if (!textSearch || textSearch.length == 0) {
      setDataContact(dataAllContact);
      return;
    }
    const textData = textSearch.toUpperCase();

    if (dataAllContact.length > 0) {
      const newData = filterContact(dataAllContact, textData);
      setDataContact(newData);
    }
  }

  const filterContact = (contacts, textData) => {
    const newData = contacts.filter((item) => {
      let givenName = item.givenName;
      let familyName = item.familyName;

      try {
        if (givenName) {
          givenName = givenName.toUpperCase();
        }
        if (familyName) {
          familyName = familyName.toUpperCase();
        }
      } catch (error) {}

      const itemName = givenName + " " + familyName;
      const checkName = itemName.indexOf(
        textData.replace(/\s{2,}/g, " ").trim()
      );
      if (checkName > -1) return true;

      const phone = item.phoneNumbers.filter((itemPhoneTest) => {
        const itemPhone = itemPhoneTest.number.replace(/\s/g, "");
        const checkPhone = itemPhone.indexOf(textData.replace(/\s/g, ""));
        if (checkPhone > -1) return true;
      });
      if (phone.length > 0) return true;

      return false;
    });
    return newData;
  };

  const onPressPlus = (currentTicket) => {
    let newData = tickets.slice();
    ++newData[currentTicket].numberBuy;
    setTickets(newData);
  };

  const onPressMinus = (currentTicket) => {
    let newData = tickets.slice();
    --newData[currentTicket].numberBuy;
    if (newData[currentTicket].numberBuy < 0)
      newData[currentTicket].numberBuy = 0;
    setTickets(newData);
  };

  return (
    <TransferTicketsComponent
      activeSlide={activeSlide}
      onBackPress={onBackPress}
      refCarousel={refCarousel}
      nextActiveSlide={nextActiveSlide}
      setActiveSlide={setActiveSlide}
      valueSearch={valueSearch}
      setSearchedValue={searchContact}
      onSwipeLeft={onSwipeLeft}
      onTransferClick={onTransferClick}
      contactEventX={dataContact}
      nextActiveSlideFirt={nextActiveSlideFirt}
      onPressCheck={onPressCheck}
      tickets={tickets}
      conversionRate={wallets.conversionRate}
      onPressMinus={onPressMinus}
      onPressPlus={onPressPlus}
      isLoading={isLoading}
      event={event}
    />
  );
};

TransferTicketsScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    evtxContactsProps: state.wallets.contacts.evtxContacts,
    profile: state.profile.uploadResponse,
    wallets: state.wallets,
  };
};

export default connect(
  mapStateToProps,
  { getEvtxContacts }
)(TransferTicketsScreen);
