import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  RefreshControl,
  Platform,
  Animated,
  AppState,
  ActivityIndicator,
  Linking,
  Text,
  NativeModules,
} from "react-native";
import { connect } from "react-redux";
import OperationList from "../../components/OperationList";
import CarouselWallet from "../WalletsScreen/CarouselWallet";
import AppHeader from "../../components/HeaderComponent";
import { translate } from "../../../App";
import NavigationService from "../../NavigationService";
import { getDataKeystore, storeKey } from "../../redux/actions/keyStore";
import * as NewRelicRN from "../../../NewRelicRN";
import { notifications } from "react-native-firebase-push-notifications";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { submitRegisterToken } from "../../redux/actions/notifications";
import { getDeviceName } from "react-native-device-info";
import Strings from "../../constants/String";
import {
  getTransactionsOfWallet,
  getWallet,
  getNumUnread,
  readNotifications,
  plusNumUnread,
  verifyEmailUrl,
  getProfileDetails,
  autoAcceptTransferTicket,
  getTransactionsOfWalletNoReload,
} from "../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import messaging from "@react-native-firebase/messaging";

const HomeScreen = (props) => {
  const {
    navigation,
    wallets,
    transactions,
    getTransactionsOfWallet,
    getTransactionsOfWalletNoReload,
    getWallet,
    plusNumUnread,
    profile,
    getProfileDetails,
    getNumUnread,
    evtxContactsProps,
  } = props;

  // console.log("thai evxCt", transactions);

  const [walletKey, setWalletKey] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [is24Hour, setIs24Hour] = useState(false);
  const [userId, setUserId] = useState(null);
  let currentTime = 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getWalletKey();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    handleSavelocale();
    NewRelicRN.nrInteraction("Wallet Screen");
    getCurrentHourFormat();
    getWalletKey();
    pushNotification();
    if (Platform.OS === "ios") {
      getToken();
      onNotificationListener();
    }
    setBadge(0);
    getNumUnread();
    getProfileDetails();
    Linking.getInitialURL().then((url) => getPassCode(url));

    AppState.addEventListener("change", checkStatusApp);
    Linking.addEventListener("url", handleDeepLink);

    setInterval(function() {
      // console.log("Reload");
      getWalletKeyNoReload();
    }, 5000);

    return () => {
      AppState.removeEventListener("change", checkStatusApp);
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const handleSavelocale = async () => {
    const deviceLanguage =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    await storeKey("@locale", getLocaleDateString(deviceLanguage));
    // console.log(getLocaleDateString(deviceLanguage));
  };

  function getLocaleDateString(localeLangue) {
    const formats = {
      "af-ZA": "yyyy/MM/dd",
      "am-ET": "d/M/yyyy",
      "ar-AE": "dd/MM/yyyy",
      "ar-BH": "dd/MM/yyyy",
      "ar-DZ": "dd-MM-yyyy",
      "ar-EG": "dd/MM/yyyy",
      "ar-IQ": "dd/MM/yyyy",
      "ar-JO": "dd/MM/yyyy",
      "ar-KW": "dd/MM/yyyy",
      "ar-LB": "dd/MM/yyyy",
      "ar-LY": "dd/MM/yyyy",
      "ar-MA": "dd-MM-yyyy",
      "ar-OM": "dd/MM/yyyy",
      "ar-QA": "dd/MM/yyyy",
      "ar-SA": "dd/MM/yy",
      "ar-SY": "dd/MM/yyyy",
      "ar-TN": "dd-MM-yyyy",
      "ar-YE": "dd/MM/yyyy",
      "arn-CL": "dd-MM-yyyy",
      "as-IN": "dd-MM-yyyy",
      "az-Cyrl-AZ": "dd.MM.yyyy",
      "az-Latn-AZ": "dd.MM.yyyy",
      "ba-RU": "dd.MM.yy",
      "be-BY": "dd.MM.yyyy",
      "bg-BG": "dd.M.yyyy",
      "bn-BD": "dd-MM-yy",
      "bn-IN": "dd-MM-yy",
      "bo-CN": "yyyy/M/d",
      "br-FR": "dd/MM/yyyy",
      "bs-Cyrl-BA": "d.M.yyyy",
      "bs-Latn-BA": "d.M.yyyy",
      "ca-ES": "dd/MM/yyyy",
      "co-FR": "dd/MM/yyyy",
      "cs-CZ": "d.M.yyyy",
      "cy-GB": "dd/MM/yyyy",
      "da-DK": "dd-MM-yyyy",
      "de-AT": "dd.MM.yyyy",
      "de-CH": "dd.MM.yyyy",
      "de-DE": "dd.MM.yyyy",
      "de-LI": "dd.MM.yyyy",
      "de-LU": "dd.MM.yyyy",
      "dsb-DE": "d. M. yyyy",
      "dv-MV": "dd/MM/yy",
      "el-GR": "d/M/yyyy",
      "en-029": "MM/dd/yyyy",
      "en-AU": "d/MM/yyyy",
      "en-BZ": "dd/MM/yyyy",
      "en-CA": "dd/MM/yyyy",
      "en-GB": "dd/MM/yyyy",
      "en-IE": "dd/MM/yyyy",
      "en-IN": "dd-MM-yyyy",
      "en-JM": "dd/MM/yyyy",
      "en-MY": "d/M/yyyy",
      "en-NZ": "d/MM/yyyy",
      "en-PH": "M/d/yyyy",
      "en-SG": "d/M/yyyy",
      "en-TT": "dd/MM/yyyy",
      "en-US": "M/d/yyyy",
      "en-ZA": "yyyy/MM/dd",
      "en-ZW": "M/d/yyyy",
      "es-AR": "dd/MM/yyyy",
      "es-BO": "dd/MM/yyyy",
      "es-CL": "dd-MM-yyyy",
      "es-CO": "dd/MM/yyyy",
      "es-CR": "dd/MM/yyyy",
      "es-DO": "dd/MM/yyyy",
      "es-EC": "dd/MM/yyyy",
      "es-ES": "dd/MM/yyyy",
      "es-GT": "dd/MM/yyyy",
      "es-HN": "dd/MM/yyyy",
      "es-MX": "dd/MM/yyyy",
      "es-NI": "dd/MM/yyyy",
      "es-PA": "MM/dd/yyyy",
      "es-PE": "dd/MM/yyyy",
      "es-PR": "dd/MM/yyyy",
      "es-PY": "dd/MM/yyyy",
      "es-SV": "dd/MM/yyyy",
      "es-US": "M/d/yyyy",
      "es-UY": "dd/MM/yyyy",
      "es-VE": "dd/MM/yyyy",
      "et-EE": "d.MM.yyyy",
      "eu-ES": "yyyy/MM/dd",
      "fa-IR": "MM/dd/yyyy",
      "fi-FI": "d.M.yyyy",
      "fil-PH": "M/d/yyyy",
      "fo-FO": "dd-MM-yyyy",
      "fr-BE": "d/MM/yyyy",
      "fr-CA": "yyyy-MM-dd",
      "fr-CH": "dd.MM.yyyy",
      "fr-FR": "dd/MM/yyyy",
      "fr-LU": "dd/MM/yyyy",
      "fr-MC": "dd/MM/yyyy",
      "fy-NL": "d-M-yyyy",
      "ga-IE": "dd/MM/yyyy",
      "gd-GB": "dd/MM/yyyy",
      "gl-ES": "dd/MM/yy",
      "gsw-FR": "dd/MM/yyyy",
      "gu-IN": "dd-MM-yy",
      "ha-Latn-NG": "d/M/yyyy",
      "he-IL": "dd/MM/yyyy",
      "hi-IN": "dd-MM-yyyy",
      "hr-BA": "d.M.yyyy.",
      "hr-HR": "d.M.yyyy",
      "hsb-DE": "d. M. yyyy",
      "hu-HU": "yyyy. MM. dd.",
      "hy-AM": "dd.MM.yyyy",
      "id-ID": "dd/MM/yyyy",
      "ig-NG": "d/M/yyyy",
      "ii-CN": "yyyy/M/d",
      "is-IS": "d.M.yyyy",
      "it-CH": "dd.MM.yyyy",
      "it-IT": "dd/MM/yyyy",
      "iu-Cans-CA": "d/M/yyyy",
      "iu-Latn-CA": "d/MM/yyyy",
      "ja-JP": "yyyy/MM/dd",
      "ka-GE": "dd.MM.yyyy",
      "kk-KZ": "dd.MM.yyyy",
      "kl-GL": "dd-MM-yyyy",
      "km-KH": "yyyy-MM-dd",
      "kn-IN": "dd-MM-yy",
      "ko-KR": "yyyy. MM. dd",
      "kok-IN": "dd-MM-yyyy",
      "ky-KG": "dd.MM.yy",
      "lb-LU": "dd/MM/yyyy",
      "lo-LA": "dd/MM/yyyy",
      "lt-LT": "yyyy.MM.dd",
      "lv-LV": "yyyy.MM.dd.",
      "mi-NZ": "dd/MM/yyyy",
      "mk-MK": "dd.MM.yyyy",
      "ml-IN": "dd-MM-yy",
      "mn-MN": "yy.MM.dd",
      "mn-Mong-CN": "yyyy/M/d",
      "moh-CA": "M/d/yyyy",
      "mr-IN": "dd-MM-yyyy",
      "ms-BN": "dd/MM/yyyy",
      "ms-MY": "dd/MM/yyyy",
      "mt-MT": "dd/MM/yyyy",
      "nb-NO": "dd.MM.yyyy",
      "ne-NP": "M/d/yyyy",
      "nl-BE": "d/MM/yyyy",
      "nl-NL": "d-M-yyyy",
      "nn-NO": "dd.MM.yyyy",
      "nso-ZA": "yyyy/MM/dd",
      "oc-FR": "dd/MM/yyyy",
      "or-IN": "dd-MM-yy",
      "pa-IN": "dd-MM-yy",
      "pl-PL": "dd.MM.yyyy",
      "prs-AF": "dd/MM/yy",
      "ps-AF": "dd/MM/yy",
      "pt-BR": "d/M/yyyy",
      "pt-PT": "dd-MM-yyyy",
      "qut-GT": "dd/MM/yyyy",
      "quz-BO": "dd/MM/yyyy",
      "quz-EC": "dd/MM/yyyy",
      "quz-PE": "dd/MM/yyyy",
      "rm-CH": "dd/MM/yyyy",
      "ro-RO": "dd.MM.yyyy",
      "ru-RU": "dd.MM.yyyy",
      "rw-RW": "M/d/yyyy",
      "sa-IN": "dd-MM-yyyy",
      "sah-RU": "MM.dd.yyyy",
      "se-FI": "d.M.yyyy",
      "se-NO": "dd.MM.yyyy",
      "se-SE": "yyyy-MM-dd",
      "si-LK": "yyyy-MM-dd",
      "sk-SK": "d. M. yyyy",
      "sl-SI": "d.M.yyyy",
      "sma-NO": "dd.MM.yyyy",
      "sma-SE": "yyyy-MM-dd",
      "smj-NO": "dd.MM.yyyy",
      "smj-SE": "yyyy-MM-dd",
      "smn-FI": "d.M.yyyy",
      "sms-FI": "d.M.yyyy",
      "sq-AL": "yyyy-MM-dd",
      "sr-Cyrl-BA": "d.M.yyyy",
      "sr-Cyrl-CS": "d.M.yyyy",
      "sr-Cyrl-ME": "d.M.yyyy",
      "sr-Cyrl-RS": "d.M.yyyy",
      "sr-Latn-BA": "d.M.yyyy",
      "sr-Latn-CS": "d.M.yyyy",
      "sr-Latn-ME": "d.M.yyyy",
      "sr-Latn-RS": "d.M.yyyy",
      "sv-FI": "d.M.yyyy",
      "sv-SE": "yyyy-MM-dd",
      "sw-KE": "M/d/yyyy",
      "syr-SY": "dd/MM/yyyy",
      "ta-IN": "dd-MM-yyyy",
      "te-IN": "dd-MM-yy",
      "tg-Cyrl-TJ": "dd.MM.yy",
      "th-TH": "d/M/yyyy",
      "tk-TM": "dd.MM.yy",
      "tn-ZA": "yyyy/MM/dd",
      "tr-TR": "dd.MM.yyyy",
      "tt-RU": "dd.MM.yyyy",
      "tzm-Latn-DZ": "dd-MM-yyyy",
      "ug-CN": "yyyy-M-d",
      "uk-UA": "dd.MM.yyyy",
      "ur-PK": "dd/MM/yyyy",
      "uz-Cyrl-UZ": "dd.MM.yyyy",
      "uz-Latn-UZ": "dd/MM yyyy",
      "vi-VN": "dd/MM/yyyy",
      "wo-SN": "dd/MM/yyyy",
      "xh-ZA": "yyyy/MM/dd",
      "yo-NG": "d/M/yyyy",
      "zh-CN": "yyyy/M/d",
      "zh-HK": "d/M/yyyy",
      "zh-MO": "d/M/yyyy",
      "zh-SG": "d/M/yyyy",
      "zh-TW": "yyyy/M/d",
      "zu-ZA": "yyyy/MM/dd",
    };

    return formats[localeLangue] || "DD/MM/yyyy";
  }

  const getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const handleDeepLink = ({ url }) => {
    getPassCode(url);
  };

  const getPassCode = (url) => {
    if (url) {
      const indexOf = url.lastIndexOf("/");
      const passcode = url.slice(indexOf + 1);
      props.verifyEmailUrl(passcode);
    }
  };

  // const checkStatusApp = (nextAppState) => {
  //   if (nextAppState == 'active') {
  //     setBadge(0);
  //     getTransactionsOfWallet(registration, 1, 10, true);
  //   }
  // }

  const checkStatusApp = (nextAppState) => {
    getNumUnread();
    if (nextAppState == "inactive") {
      currentTime = 0;
      return;
    }
    if (nextAppState == "background" && currentTime == 0) {
      currentTime = new Date().getTime() / 1000;
      return;
    }
    if (nextAppState == "active" && currentTime != 0) {
      checkShowFaceId();
      getWallet();
    }
  };

  const checkShowFaceId = async () => {
    const timestamp = new Date().getTime() / 1000 - currentTime;
    let minutes = Math.floor(timestamp / 60);
    if (minutes >= 1) {
      const reLogin = await getDataKeystore("@reLogin");
      if (!reLogin || reLogin == "false") {
        await storeKey("@reLogin", "true");
        NavigationService.navigate("Login");
        currentTime = 0;
      } else {
        currentTime = 0;
      }
    } else {
      currentTime = 0;
    }
  };

  const getToken = async () => {
    const token = await notifications.getToken();
    registerToken(token);
    return token;
  };

  const onNotificationListener = () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the forground/runnning
    //for android make sure you manifest is setup - else this wont work
    //Android will not have any info set on the notification properties (title, subtitle, etc..), but _data will still contain information
    notifications.onNotification((notification) => {
      refreshWallet();
      sentNotifi(notification);
    });

    notifications.onNotificationOpened((notification) => {
      refreshWallet();
      if (!isCheckTopUpLocal(notification)) {
        getNumUnread();
        NavigationService.navigate("NotificationNavigator");
      } else {
        NavigationService.navigate("WalletsStack");
      }
    });
  };

  const refreshWallet = () => {
    getWallet();
    getTransactionsOfWallet(1, 10, true);
  };

  const sentNotifi = (notification) => {
    getNumUnread();
    const isTopUp = !isCheckTopUp(notification);
    let dataNoti;

    if (Platform.OS === "android") {
      dataNoti = {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        channelId: notification.channelId,
      };
    } else {
      dataNoti = {
        id: notification._notificationId,
        title: notification._title,
        message: notification._body,
      };
    }
    if (isTopUp) {
      plusNumUnread();
    } else {
      dataNoti = {
        ...dataNoti,
        userInfo: {
          notificationType: Strings.TOP_UP_SUCCESS,
        },
      };
    }
    if (Platform.OS == "android") {
      PushNotification.localNotification(dataNoti);
    } else {
      PushNotificationIOS.presentLocalNotification({
        alertBody: notification._body,
        alertTitle: notification._title,
        userInfo: {
          notificationType: Strings.TOP_UP_SUCCESS,
        },
      });
    }
  };

  const isCheckTopUp = (notification) => {
    try {
      const isAndroid = Platform.OS === "android";
      let data = notification.data;
      if (data) {
        if (!isAndroid) {
          data = data.data;
        }
        if (
          data &&
          data.notificationType &&
          data.notificationType == Strings.TOP_UP_SUCCESS
        ) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const isCheckTopUpLocal = (notification) => {
    try {
      const isAndroid = Platform.OS === "android";
      let data = notification.data;

      if (
        data &&
        data.notificationType &&
        data.notificationType == Strings.TOP_UP_SUCCESS
      ) {
        return true;
      }

      if (!isAndroid) {
        data = data.data;
        if (
          data &&
          data.notificationType &&
          data.notificationType == Strings.TOP_UP_SUCCESS
        ) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  function pushNotification() {
    console.log("Regis token");
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      onRegister: function(token) {
        // console.log("TOKEN:", token);
        if (Platform.OS === "android") {
          registerToken(token.token);
        }
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function(notification) {
        // (required) Called when a remote is received or opened, or local notification is opened
        refreshWallet();
        if (Platform.OS === "android") {
          if (!notification.userInteraction) {
            sentNotifi(notification);
          } else {
            if (!isCheckTopUpLocal(notification)) {
              NavigationService.navigate("NotificationNavigator");
            } else {
              NavigationService.navigate("WalletsStack");
            }
          }
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        NewRelicRN.nrError(err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  async function registerToken(token) {
    console.log("tokennnnn", token);
    let deviceName = await getDeviceName();
    const userId = await getDataKeystore("@userId");
    if (userId) {
      await submitRegisterToken(userId, token, Platform.OS, deviceName);
    }
  }

  const setBadge = async (number) => {
    //only works on iOS for now
    return await notifications.setBadge(number);
  };

  const getWalletKey = async () => {
    const walletKey = await getDataKeystore("@walletMainKey");
    setWalletKey(walletKey);
    const userId = await getDataKeystore("@userId");
    setUserId(userId);
    NewRelicRN.nrAddUserId(userId);

    getWallet();
    getTransactionsOfWallet(1, 10, true);
    autoAcceptTransferTicket();
  };

  const getWalletKeyNoReload = async () => {
    const walletKey = await getDataKeystore("@walletMainKey");
    setWalletKey(walletKey);
    const userId = await getDataKeystore("@userId");
    setUserId(userId);
    NewRelicRN.nrAddUserId(userId);

    getWallet();
    getTransactionsOfWalletNoReload(1, 10, true);
    autoAcceptTransferTicket();
  };

  const handleLoadMore = () => {
    const pages = props.transactions.pages;
    const page = props.transactions.page;
    const limit = props.transactions.limit;
    if (page <= pages && transactions.data.length > 0) {
      getTransactionsOfWallet(page, limit);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 10;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const getMoreDate = () => {
    if (!props.transactions.isLoadingMore && !props.transactions.isLoading) {
      handleLoadMore();
    }
  };

  const gotoTopupToken = () => {
    NavigationService.navigate("TopUpTokens");
  };

  const renderLoading = () => {
    if (transactions.isLoading) {
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    }
    if (
      !transactions.isLoading &&
      !transactions.data[0] &&
      wallets.currentCardId == 0
    ) {
      return (
        <View style={styles.viewDataNull}>
          <Text style={styles.textDataNullStyle}>
            You have no transactions yet.
          </Text>
          <Text style={styles.textDataNullStyle}>
            Let’s{" "}
            <Text onPress={gotoTopupToken} style={styles.textWarning}>
              top up some tokens
            </Text>
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        isSearch
        title={translate("Wallets")}
        params={{ isNotification: true }}
      >
        <Animated.ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={160}
          onScroll={Animated.event([], {
            listener: (event) => {
              if (isCloseToBottom(event.nativeEvent)) {
                getMoreDate();
              }
            },
          })}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <CarouselWallet
            walletCarousel
            conversionRate={wallets.conversionRate}
          />

          <View>
            {!props.transactions.isLoading && (
              <OperationList
                currentCardId={wallets.currentCardId}
                transactions={transactions}
                conversionRate={wallets.conversionRate}
                handleLoadMore={handleLoadMore}
                isLoadingMore={props.transactions.isLoadingMore}
                isLoading={props.transactions.isLoading}
                refreshing={refreshing}
                userId={userId}
                is24Hour={is24Hour}
              />
            )}
          </View>
        </Animated.ScrollView>
        {renderLoading()}
      </AppHeader>
    </View>
  );
};

HomeScreen.navigationOptions = {
  title: "Wallet",
  headerShown: false,
  headerMode: "none",
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    transactions: state.transactions,
    profile: state.profile,
    evtxContactsProps: state.wallets.contacts.evtxContacts,
  };
};

export default connect(
  mapStateToProps,
  {
    getTransactionsOfWallet,
    getWallet,
    getNumUnread,
    readNotifications,
    plusNumUnread,
    verifyEmailUrl,
    getProfileDetails,
    getTransactionsOfWalletNoReload,
  }
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 50,
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
  viewDataNull: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  textDataNullStyle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.4)",
  },
  textWarning: {
    color: "#EA5284",
  },
});
