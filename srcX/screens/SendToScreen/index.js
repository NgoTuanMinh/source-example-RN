import React, { useState, useEffect } from "react";
import {
  PermissionsAndroid,
  Alert,
  Platform,
  Linking,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  AppState,
} from "react-native";
import { connect } from "react-redux";
import Contacts from "react-native-contacts";
import ContactListSentTo from "../../components/ListComponent/ContactListSentTo";
import AppHeader from "../../components/HeaderComponent";
import { getEvtxContacts } from "../../redux/actions/index";
import { translate } from "../../../App";
import { Text, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { getDataKeystore } from "../../redux/actions/keyStore";

const SendToScreen = (props) => {
  const {
    navigation,
    getEvtxContacts,
    unEvtxContacts,
    evtxContactsProps,
    profile,
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

  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const evtxContacts = (contacts) => {
    //setIsLoadingEvtContact(true);
    getEvtxContacts(contacts);
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
    searchFilterFunction(textSearch);
  }, [textSearch]);

  const sortByName = (contact1, contact2) => {
    let nameContact1 = contact1.givenName
      ? contact1.givenName
      : contact1.familyName;
    let nameContact2 = contact2.givenName
      ? contact2.givenName
      : contact2.familyName;
    return nameContact1.localeCompare(nameContact2);
  };

  useEffect(() => {
    const newData = unEvtxContacts.filter((item) =>
      checkOwnPhoneNumber(item, true)
    );
    setDataFilterEventX(newData);
  }, [unEvtxContacts]);

  useEffect(() => {
    setIsLoadingEvtContact(false);
    const newData = evtxContactsProps.filter((item) =>
      checkOwnPhoneNumber(item)
    );
    setDataFilterEvtxContactsProps(newData);
  }, [evtxContactsProps]);

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
      } catch (error) {
        console.log("error", error);
      }

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
    } catch (error) {
      console.log("error ", error);
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
    setDataFilter(conFilter);
    setIsLoadingEvtContact(true);
    setIsLoading(false);
    setContacts(conFilter);
    evtxContacts(conFilter);
  };

  useEffect(() => {
    checkCacheContact();
  }, []);

  const checkCacheContact = async () => {
    const cacheContacts = await getDataKeystore("@contacts");
    if (Platform.OS === "ios") {
      checkMultiPermissionsIos();
    }
    if (Platform.OS === "android") {
      checkMultiPermissionsAndroid();
    }
    //}
  };

  const params = {
    isNotification: true,
    routeNameNotification: "Notification",
    countNotice: props.notifi.numUnread,
    routeNameGoBack: "Wallets",
    isGoBack: true,
    // nameIcon: "angle-left",
    // typeIcon: "font-awesome"
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader title="SEND TO" params={params}>
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

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => setTextSearch("")}
          >
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
          nameScreen="SendTo"
          isNotPermission={isNotPermission}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </AppHeader>
    </View>
  );
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
    unEvtxContacts: state.wallets.contacts.unEvtxContacts,
    evtxContactsProps: state.wallets.contacts.evtxContacts,
    profile: state.profile.uploadResponse,
  };
};

export default connect(
  mapStateToProps,
  { getEvtxContacts }
)(SendToScreen);
