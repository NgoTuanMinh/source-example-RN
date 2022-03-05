import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  Dimensions,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button, Text, ListItem } from "react-native-elements";
import theme from "../../styles/themeStyles";
import { storeKey, getDataKeystore } from "../../redux/actions/keyStore";
import LinearGradient from "react-native-linear-gradient";
import { bindActionCreators } from "redux";
import { HeaderCustomComponent } from "./SecurityScreen";
import * as Images from "../../components/Icons/CircleIcons";
import {
  onChangeSecurityInfo,
  onResetSecurityReducer,
  resetRerifyEmailUrl,
} from "../../redux/actions/securityAction";
import {
  validateIsEmail,
  validatePhone,
} from "../RecoverAccount/RecoverAccountScreen";
import SearchComponent from "../../components/SearchComponent";
import libphonenumber from "google-libphonenumber";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";
import { Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const _keyExtractor = (item, index) => String(index);

function VerifyPhoneNumberScreen(props) {
  const {
    navigation,
    user,
    countries,
    onVerifyPhoneNumber,
    onResetSecurityReducer,
    securityReducer,
    resetRerifyEmailUrl,
  } = props;

  const [visibleCountryCode, setVisibleCountryCode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    user.phoneNumber?.slice(3) || ""
  );
  const [countryCode, setCountryCode] = useState(
    user.phoneNumber?.slice(0, 3) || ""
  );
  const [isFocus, setIsFocus] = useState(false);
  const [email, setEmail] = useState(user.email ? user.email : "");
  const [searchedValue, setSearchedValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [isLoading, setIsLoading] = useState(false);

  const isVerifyPhoneNumber =
    navigation?.state?.params?.isVerifyPhoneNumber || false;
  const isPayment = navigation?.state?.params?.isPayment || false;
  const selectedData = navigation.state.params.selectedData || 0;
  const isCoreTopup = navigation?.state?.params?.isCoreTopup;

  // console.log("thai tp", isTopupCore);

  const title = isVerifyPhoneNumber
    ? "PHONE VERIFICATION"
    : "EMAIL VERIFICATION";
  const labelBody = isVerifyPhoneNumber
    ? "ENTER YOUR PHONE NUMBER"
    : "ENTER YOUR EMAIL";
  const textNoteBody = isVerifyPhoneNumber
    ? "mobile phone number"
    : "email address";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsFocus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsFocus(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    var newFilteredList = countries.filter((item) =>
      item.name.toLowerCase().includes(
        searchedValue
          .toLowerCase()
          .replace(/\s{2,}/g, " ")
          .trim()
      )
    );

    if (!newFilteredList || newFilteredList.length == 0) {
      newFilteredList = countries.filter((item) =>
        item.code.toLowerCase().includes(searchedValue.toLowerCase())
      );
    }
    setFilteredCountries(newFilteredList);
  }, [searchedValue]);

  useEffect(() => {
    setIsLoading(false);
    if (securityReducer.isVerifySecurity === true) {
      if (isVerifyPhoneNumber) {
        const params = {
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          handleVerify: () => handleVerify(),
        };
        navigation.navigate("VerifyCodeToSecurity", params);
      } else {
        const params = {
          email: email,
          isPayment,
          selectedData,
          isCoreTopup: isCoreTopup,
          handleVerify: () => handleVerify(),
        };
        navigation.navigate("VerifyCodeToSecurity", params);
      }
    } else {
      if (securityReducer.isVerifySecurity.data) {
        //let mess = isVerifyPhoneNumber ? "Phone number is not valid." : "Email address is already existed.";
        let mess = securityReducer.isVerifySecurity.data.Error;
        Alert.alert("Warning", mess, [{ text: "OK", onPress: () => {} }], {
          cancelable: false,
        });
      }
    }
    return () => {
      _onResetSecurityReducer();
    };
  }, [securityReducer.isVerifySecurity]);

  const _onResetSecurityReducer = async () => {
    onResetSecurityReducer();
  };

  const handleVerify = async () => {
    setIsLoading(true);
    const params = {
      to: isVerifyPhoneNumber ? countryCode + phoneNumber : email,
      via: isVerifyPhoneNumber ? "sms" : "email",
    };
    resetRerifyEmailUrl();
    onVerifyPhoneNumber(params);
  };

  const checkDisabledButtonVerify = () => {
    let check = true;
    if (
      isVerifyPhoneNumber &&
      validatePhone(countryCode + phoneNumber) &&
      phoneNumber.length >= 9
    ) {
      check = false;
    } else if (!isVerifyPhoneNumber && validateIsEmail(email)) {
      check = false;
    }
    return check;
  };

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#EA5284" />
      </View>
    );
  };

  const backAction = NavigationActions.back({
    key: null,
  });

  return (
    <SafeAreaView
      style={[theme.droidSafeArea, { backgroundColor: "white", paddingTop: 0 }]}
    >
      <HeaderCustomComponent
        title={title}
        onPress={() => {
          if (isPayment) {
            // console.log("thai back", navigation.goBack());
            // console.log(selectedData);
            // navigation.navigate("PaymentScreen", {
            //   selectedData: selectedData,
            // });
            // console.log("thai");
            // navigation.pop(2);
            if (isCoreTopup) {
              navigation.dispatch(backAction);
              return;
            } else {
              navigation.dispatch(backAction);
              navigation.dispatch(backAction);
              return;
            }
          }
          navigation.goBack();
        }}
      />
      <View style={theme.container}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 80}
        >
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <View style={styles.contentStyle}>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {labelBody}
              </Text>

              {/* <Text style={{ opacity: 0.4, alignSelf: 'center', marginTop: 10 }}>
                Enter your {textNoteBody}
              </Text> */}
              {/* <View
                style={{
                  height: deviceHeight - 300,
                  justifyContent: "center",
                  // paddingBottom: 200,
                  // backgroundColor: "red",
                }}
              > */}
              <View
                style={{
                  // height: Dimensions.get("window").height - 100,
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  // backgroundColor: "red",
                  paddingBottom: 55,
                }}
              >
                {isVerifyPhoneNumber ? (
                  <InputPhoneNumber
                    countryCode={countryCode}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    setVisibleCountryCode={setVisibleCountryCode}
                    isFocus={isFocus}
                  />
                ) : (
                  <InputEmail
                    email={email}
                    setEmail={setEmail}
                    isFocus={isFocus}
                    checkDisabledButtonVerify={checkDisabledButtonVerify}
                    isVerifyPhoneNumber={isVerifyPhoneNumber}
                  />
                )}
              </View>
              <View style={{ marginTop: 40 }}>
                {checkDisabledButtonVerify() &&
                  isVerifyPhoneNumber &&
                  phoneNumber.length > 8 && (
                    <Text style={{ color: "red" }}>
                      Phone number is not valid.
                    </Text>
                  )}
                {/* {checkDisabledButtonVerify() &&
                  !isVerifyPhoneNumber &&
                  email.length > 8 && (
                    <Text style={{ color: "red" }}>Email is not valid.</Text>
                  )} */}
              </View>
              {/* </View> */}
            </View>

            <Button
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#FF6195", "#C2426C"],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
              title="VERIFY"
              titleStyle={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}
              disabled={checkDisabledButtonVerify()}
              disabledStyle={{ opacity: 0.2 }}
              disabledTitleStyle={{ color: "#fff", opacity: 1 }}
              onPress={() => handleVerify()}
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      {renderLoading()}
      <ModalCountryCode
        visible={visibleCountryCode}
        data={filteredCountries}
        setVisibleCountryCode={setVisibleCountryCode}
        setCountryCode={setCountryCode}
        setSearchedValue={setSearchedValue}
        searchedValue={searchedValue}
      />
    </SafeAreaView>
  );
}

const InputPhoneNumber = ({
  countryCode,
  phoneNumber,
  setPhoneNumber,
  isFocus,
  setVisibleCountryCode,
}) => {
  return (
    <View style={styles.inputPhoneNumberContainer}>
      <TouchableOpacity
        style={styles.countryCodeContainer}
        onPress={() => setVisibleCountryCode(true)}
      >
        <Text style={{ color: "rgba(0,0,0,0.4)", fontSize: 14 }}>Country</Text>

        <View style={styles.flexRow}>
          <TextInput
            pointerEvents="none"
            placeholder="+00"
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={styles.input}
            editable={false}
            value={countryCode}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
          />
          <View
            style={{
              position: "absolute",
              right: 10,
              top: Platform.OS == "android" ? "30%" : "20%",
              opacity: 0.3,
            }}
          >
            <Icon name="angle-down" type="font-awesome" />
          </View>
          {/* <Image source={Images.icDropdown} style={{ width: 25, height: 25, backgroundColor: 'green' }} /> */}
        </View>
      </TouchableOpacity>

      <View style={[styles.countryCodeContainer, { flex: 3 }]}>
        <Text style={{ color: isFocus ? "#EA5284" : "rgba(0,0,0,0.4)" }}>
          Phone number
        </Text>
        <TextInput
          placeholderTextColor="rgba(0,0,0,0.3)"
          style={styles.input}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
    </View>
  );
};

const InputEmail = ({
  email,
  setEmail,
  isFocus,
  isVerifyPhoneNumber,
  checkDisabledButtonVerify,
}) => {
  return (
    // <ScrollView>
    <View
      style={{
        // marginTop: isIphoneXorAbove() ? "50%" : 150,
        // marginTop: "50%",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: isFocus ? "#EA5284" : "rgba(0,0,0,0.4)" }}>
        Email address
      </Text>
      <TextInput
        placeholder="abc123@gmail.com"
        placeholderTextColor="rgba(0,0,0,0.3)"
        style={[
          styles.inputEmail,
          {
            borderBottomWidth: 1,
            borderColor: isFocus ? "#EA5284" : "rgba(0,0,0,0.2)",
          },
        ]}
        underlineColorAndroid="transparent"
        value={email}
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      {checkDisabledButtonVerify() &&
        !isVerifyPhoneNumber &&
        email.length > 8 && (
          <Text style={{ color: "red", marginTop: 5 }}>
            Email is not valid.
          </Text>
        )}
    </View>
    // </ScrollView>
  );
};

const ModalCountryCode = ({
  visible,
  data,
  setVisibleCountryCode,
  setCountryCode,
  setSearchedValue,
  searchedValue,
}) => {
  const hideModalClose = () => {
    setVisibleCountryCode(false);
    setSearchedValue("");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <SearchComponent
            setSearchedValue={setSearchedValue}
            hiddenModal={hideModalClose}
            values={searchedValue}
          />
          <FlatList
            style={{ flex: 1 }}
            data={data}
            keyExtractor={_keyExtractor}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CountriesCodeItem
                item={item}
                setVisibleCountryCode={setVisibleCountryCode}
                setCountryCode={setCountryCode}
              />
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const CountriesCodeItem = ({ item, setVisibleCountryCode, setCountryCode }) => {
  const touchHandler = () => {
    setCountryCode(item.code);
    setVisibleCountryCode(false);
  };

  return (
    <TouchableWithoutFeedback onPress={touchHandler}>
      <ListItem
        title={item.name}
        titleStyle={{ fontSize: 16, marginTop: 0 }}
        leftElement={<Text style={{ fontSize: 32 }}>{item.flag}</Text>}
        rightElement={<Text style={styles.code}>{item.code}</Text>}
        containerStyle={{
          flex: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    flex: 1,
  },
  icBack: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  btnBack: {
    position: "absolute",
    zIndex: 1,
    padding: 15,
  },
  textTitleHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerContainer: {
    paddingVertical: 15,
    justifyContent: "center",
  },
  flexRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red'
  },
  marginLeft: {
    marginLeft: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    width: "100%",
    minHeight: 40,
    color: "#000",
  },
  inputEmail: {
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    width: deviceWidth * 0.9,
    minHeight: 40,
    color: "#000",
  },
  form: {
    flex: 1,
  },
  inputPhoneNumberContainer: {
    flexDirection: "row",
    // paddingTop: 30,
    // marginTop: isIphoneXorAbove() ? 220 : 110,
    // marginTop: deviceHeight * 0.2,
  },
  countryCodeContainer: {
    flex: 1,
    marginRight: 7,
  },
  list: {
    paddingBottom: 30,
  },
  code: {
    color: "#EA5284",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
  },
  contentStyle: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  buttonStyle: {
    width: deviceWidth * 0.9,
    alignSelf: "center",
    paddingVertical: 10,
    height: 56,
    marginBottom: 20,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, .3)",
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.registration.profile,
    countries: state.countryCodes.countries,
    securityReducer: state.security,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onVerifyPhoneNumber: bindActionCreators(onChangeSecurityInfo, dispatch),
    onResetSecurityReducer: bindActionCreators(
      onResetSecurityReducer,
      dispatch
    ),
    resetRerifyEmailUrl: bindActionCreators(resetRerifyEmailUrl, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyPhoneNumberScreen);
