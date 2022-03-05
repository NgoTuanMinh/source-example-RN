import React, { useState, useEffect } from "react";
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  TextInput,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import Contacts from "react-native-contacts";
import ContactList from "../../components/ListComponent/ContactList";
import AppHeader from "../../components/HeaderComponent";
import { getEvtxContacts, getNumUnread } from "../../redux/actions/index";
import Bugfender from "@bugfender/rn-bugfender";
import BackgroundFetch from "react-native-background-fetch";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { translate } from "../../../App";
import { NavigationEvents } from "react-navigation";
import { openSettings } from "react-native-permissions";
import * as NewRelicRN from "../../../NewRelicRN";
import LinearGradient from "react-native-linear-gradient";
import { Text, Icon } from "react-native-elements";
import ContactListSentTo from "../../components/ListComponent/ContactListSentTo";

const ContactsScreen = (props) => {
  const {
    getEvtxContacts,
    navigation,
    profile,
    unEvtxContacts,
    evtxContactsProps,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvtContact, setIsLoadingEvtContact] = useState(false);
  const [isNotPermission, setPermission] = useState(false);

  const [textSearch, setTextSearch] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const [dataFilterEventX, setDataFilterEventX] = useState([]);
  const [
    dataFilterEvtxContactsProps,
    setDataFilterEvtxContactsProps,
  ] = useState([]);

  const [contacts, setContacts] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const checkOwnPhoneNumber = (item, isEventX = false) => {
    let number = item.phoneNumbers
      ? item.phoneNumbers[0]
        ? item.phoneNumbers[0].number
        : null
      : null;
    number = number?.replace(/[ ()-]/gi, "");
    if (item.givenName == "" && item.familyName == "" && isEventX) {
      return false;
    }
    return !profile?.phoneNumber?.includes(number);
  };

  useEffect(() => {
    NewRelicRN.nrInteraction("ContactsScreen");
    checkAllPermission();
  }, []);

  useEffect(() => {
    if (unEvtxContacts) {
      const newData = unEvtxContacts.filter((item) =>
        checkOwnPhoneNumber(item, true)
      );
      setDataFilterEventX(newData);
    }
  }, [unEvtxContacts]);

  useEffect(() => {
    setIsLoadingEvtContact(false);
    if (evtxContactsProps) {
      const newData = evtxContactsProps.filter((item) =>
        checkOwnPhoneNumber(item)
      );
      setDataFilterEvtxContactsProps(newData);
    }
  }, [evtxContactsProps]);

  useEffect(() => {
    searchFilterFunction(textSearch);
  }, [textSearch]);

  function searchFilterFunction(text) {
    const textSearch = text.trimLeft();
    setTextSearch(textSearch);
    if (!textSearch || textSearch.length == 0) {
      setDataFilter(contacts);
      setDataFilterEventX(unEvtxContacts);
      setDataFilterEvtxContactsProps(evtxContactsProps);
      return;
    }
    const textData = textSearch.toUpperCase();

    if (unEvtxContacts.length > 0) {
      const newData = filterContact(unEvtxContacts, textData);
      setDataFilterEventX(newData);
    }

    if (evtxContactsProps.length > 0) {
      const newData = filterContact(evtxContactsProps, textData);
      setDataFilterEvtxContactsProps(newData);
      return;
    }

    if (dataFilter.length > 0) {
      const newData = filterContact(contacts, textData);
      setDataFilter(newData);
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

  const evtxContacts = (contact, hash) => {
    setIsLoadingEvtContact(true);
    if (hash) {
      const otherContacts = contact.filter((item) => checkOwnPhoneNumber(item));
      getEvtxContacts(otherContacts, hash);
    } else {
      const otherContacts = contact.evtxContacts?.filter((item) =>
        checkOwnPhoneNumber(item)
      );
      contact.evtxContacts = otherContacts;
      getEvtxContacts(contact.unEvtxContacts, hash);
    }
    Bugfender.d("evtx-contacts", `ContactsScreen evtxContacts called`);
  };

  function getAllContactAPI() {
    Contacts.getAll((err, con) => {
      setIsLoading(false);
      if (err === "denied") {
        Alert.alert(
          "Warning!",
          "You have not enabled contacts permissions",
          [
            { text: "Try again", onPress: () => checkMultiPermissionsIos() },
            { text: "OK", onPress: () => setPermission(true) },
          ],

          { cancelable: false }
        );
        Bugfender.e(
          "evtx-contacts",
          `ContactsScreen checkPermission IOS permission Authorized but error denied=${JSON.stringify(
            err
          )}`
        );
        return;
      } else {
        let conFilter = [];
        for (let i = 0; i < con.length; ++i) {
          const item = con[i];
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
        conFilter.sort(sortByName);
        setDataFilterEventX(conFilter);
        setDataFilter(conFilter);
        setContacts(conFilter);
        evtxContacts(conFilter, true);
      }
    });
  }

  const sortByName = (contact1, contact2) => {
    let nameContact1 = contact1.givenName
      ? contact1.givenName
      : contact1.familyName;
    let nameContact2 = contact2.givenName
      ? contact2.givenName
      : contact2.familyName;
    return nameContact1.localeCompare(nameContact2);
  };

  function loadContactsAfterPermission(permission) {
    if (permission === "authorized") {
      Bugfender.d(
        "evtx-contacts",
        `ContactsScreen checkPermission IOS authorized permission=${JSON.stringify(
          permission
        )}`
      );
      getAllContactAPI();
    }
    if (permission === "denied") {
      Alert.alert(
        "Warning!",
        "You have not enabled contacts permissions",
        [
          { text: "OK", onPress: () => setPermission(true) },
          { text: "Enable", onPress: () => openSettings() },
        ],
        { cancelable: false }
      );
    }
  }

  function checkMultiPermissionsIos() {
    Contacts.checkPermission((err, permission) => {
      Bugfender.d(
        "evtx-contacts",
        `ContactsScreen checkPermission IOS err=${JSON.stringify(
          err
        )} and permission ${permission}`
      );
      if (err) throw err;
      if (permission === "undefined") {
        Contacts.requestPermission((err, perm) => {
          loadContactsAfterPermission(perm);
        });
      } else {
        loadContactsAfterPermission(permission);
      }
    });
  }

  function checkMultiPermissionsIosCached(cacheContacts, hash) {
    Contacts.checkPermission((err, permission) => {
      Bugfender.d(
        "evtx-contacts",
        `ContactsScreen checkPermission IOS err=${JSON.stringify(
          err
        )} and permission ${permission}`
      );
      if (err) throw err;
      if (permission === "undefined") {
        Contacts.requestPermission((err, perm) => {
          if (perm === "authorized") {
            // setIsLoadingEvtContact(true);
            // setDataFilter(conFilter);
            // setContacts(conFilter);
            // setIsLoading(false);
            evtxContacts(cacheContacts, hash);
          }
        });
      } else if (permission === "authorized") {
        // setIsLoadingEvtContact(true);
        // setDataFilter(conFilter);
        // setContacts(conFilter);
        // setIsLoading(false);
        evtxContacts(cacheContacts, hash);
      } else if (permission === "denied") {
        Alert.alert(
          "Warning!",
          "You have not enabled contacts permissions",
          [
            { text: "OK", onPress: () => setPermission(true) },
            { text: "Enable", onPress: () => openSettings() },
          ],
          { cancelable: false }
        );
      }
    });
  }

  function checkMultiPermissionsAndroid() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getAllContactAPI();
        } else {
          Alert.alert(
            "Warning!",
            "You have not enabled contacts permissions",
            [
              { text: "OK", onPress: () => setPermission(true) },
              { text: "Enable", onPress: () => openSettings() },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        setPermission(true);
        // console.log('checkMultiPermissionsAndroid', error);
      });
  }

  function checkMultiPermissionsAndroidCached(cacheContacts, hash) {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
      .then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // setIsLoadingEvtContact(true);
          // setDataFilter(conFilter);
          // setContacts(conFilter);
          // setIsLoading(false);
          evtxContacts(cacheContacts, hash);
        }
      })
      .catch((error) => {
        // console.log('checkMultiPermissionsAndroidCached error', error);
      });
  }

  const checkAllPermission = () => {
    setIsLoading(true);
    setPermission(false);
    (async function contactsFromCache() {
      if (contacts) {
        console.log("return");
        return;
      }

      // let cacheContacts = await getDataKeystore("@contacts");
      // cacheContacts = JSON.parse(cacheContacts);
      // if (cacheContacts && cacheContacts.unEvtxContacts.length > 0) {
      //     let cacheContactsunEvtxfilter = cacheContacts.unEvtxContacts.filter(item => filterPhoneNumberNameNull(item));
      //     cacheContacts.unEvtxContacts = cacheContactsunEvtxfilter
      //     if (Platform.OS === 'ios') {
      //         checkMultiPermissionsIosCached(cacheContacts, false);
      //     }
      //     if (Platform.OS === 'android') {
      //         checkMultiPermissionsAndroidCached(cacheContacts, false);
      //     }
      // } else {
      if (Platform.OS === "ios") {
        checkMultiPermissionsIos();
      }
      if (Platform.OS === "android") {
        checkMultiPermissionsAndroid();
      }
      //}
    })();
    // BackgroundFetch.configure({
    //     minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
    //     // Android options
    //     forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
    //     stopOnTerminate: false,
    //     startOnBoot: true,
    //     requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
    //     requiresCharging: false,      // Default
    //     requiresDeviceIdle: false,    // Default
    //     requiresBatteryNotLow: false, // Default
    //     requiresStorageNotLow: false  // Default
    // }, async (taskId) => {
    //     Bugfender.d("evtx-contacts", `ContactsScreen RNBackgroundFetch started`);
    //     // Required: Signal completion of your task to native code
    //     // If you fail to do this, the OS can terminate your app
    //     // or assign battery-blame for consuming too much background-time

    //     if (Platform.OS === 'ios') {
    //         checkMultiPermissionsIos();
    //     }
    //     if (Platform.OS === 'android') {
    //         checkMultiPermissionsAndroid();
    //     }
    //     BackgroundFetch.finish(taskId);
    // }, (error) => {
    //     Bugfender.e("evtx-contacts", `ContactsScreen RNBackgroundFetch failed to start ${JSON.stringify(error)}`);
    // });
  };

  const onBack = () => {
    navigation.goBack();
    //navigation.navigate('Wallet');
    Keyboard.dismiss();
  };

  const onCloseSearch = () => {
    setTextSearch("");
    Keyboard.dismiss();
  };

  const params = {
    isNotification: true,
    routeNameNotification: "Notification",
    countNotice: props.notifi.numUnread,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* <NavigationEvents
                onWillFocus={checkAllPermission}
            /> */}
      <AppHeader
        title={translate("Contacts")}
        params={params}
        handleClick={onBack}
      >
        <View style={[styles.header]}>
          <View style={styles.buttons} />
          <View style={styles.searchField}>
            <TextInput
              value={textSearch}
              placeholder={translate("Search") + "..."}
              onChangeText={(text) => setTextSearch(text)}
              style={{ fontSize: 16, alignItems: "center" }}
            />
          </View>

          <TouchableOpacity style={styles.buttons} onPress={onCloseSearch}>
            {!textSearch ? (
              <Icon
                name="search"
                size={Platform.OS === "ios" ? 25 : 26}
                type="material"
                color="black"
              />
            ) : (
              <Icon name="close" color="black" type="antdesign" size={22} />
            )}
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["#F2F2F2", "#FAFAFA", "#fff"]}
          style={styles.linearGradient}
        />

        <ContactListSentTo
          allContacts={dataFilter}
          unEvtxContacts={dataFilterEventX}
          evtxContacts={dataFilterEvtxContactsProps}
          isLoading={isLoading}
          isLoadingEvtContact={isLoadingEvtContact}
          nameScreen="Contacts"
          isNotPermission={isNotPermission}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </AppHeader>
    </View>
  );
};

ContactsScreen.navigationOptions = {
  title: "Contacts",
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    width: "100%",
  },
  header: {
    textAlign: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",

    // shadowColor: 'rgba(0,0,0,0.3)',
    // shadowOffset: {
    //     width: 0,
    //     height: 3
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 16.0,
    // elevation: 15,
    // marginBottom: 10,
  },
  searchField: {
    flex: 1,
    overflow: "hidden",
    textAlign: "left",
  },
  buttons: {
    paddingBottom: 12,
    paddingTop: 12,
    paddingRight: 15,
  },
  linearGradient: {
    height: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    notifi: state.notifications,
    profile: state.profile.uploadResponse,

    unEvtxContacts: state.wallets.contacts.unEvtxContacts,
    evtxContactsProps: state.wallets.contacts.evtxContacts,
  };
};

export default connect(
  mapStateToProps,
  { getEvtxContacts }
)(ContactsScreen);
