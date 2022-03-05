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
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, ThemeProvider, Text } from "react-native-elements";
import theme from "../../styles/themeStyles";
import LinearGradient from "react-native-linear-gradient";
import {
  setUserPhone,
  createUserAccount,
  showLoading,
} from "../../redux/actions/index";
import libphonenumber from "google-libphonenumber";
import { translate } from "../../../App";
import HeaderLeftComponent from "../../components/HeaderComponent/HeaderLeftComponent";
import { storeKey } from "../../redux/actions/keyStore";
import { Icon } from "react-native-elements";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const PhoneNumberScreen = ({
  navigation,
  countryCode,
  setUserPhone,
  userPhone,
  countryFlag,
  createUserAccount,
  smsError,
  loading,
  showLoading,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [onFocusPhone, setFocusPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    isValidPhoneNumber();
  }, [countryCode, userPhone]);

  const handleContiue = async () => {
    setIsLoading(true);
    showLoading(true);
    Keyboard.dismiss();
    const phoneNumber = countryCode + userPhone;
    await storeKey("@countryCode", countryCode);
    createUserAccount(phoneNumber);
  };

  const isValidPhoneNumber = () => {
    try {
      if (countryCode && userPhone.length > 8) {
        const phoneNumber = countryCode + userPhone;
        const phoneParsed = phoneUtil.parse(phoneNumber, countryFlag);
        setIsValid(phoneUtil.isValidNumber(phoneParsed));
      }
    } catch (error) {
      setIsValid(false);
    }
  };

  const onFocus = () => {
    setFocusPhone(true);
  };

  const onBlur = () => {
    setFocusPhone(false);
  };

  const openRecoveryScreen = () => {
    Keyboard.dismiss();
    let params = { phoneNumberScreen: true };
    navigation.navigate("RecoverAccountScreen", params);
  };

  const renderLoading = () => {
    if (isLoading)
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="#EA5284" />
        </View>
      );
  };

  useEffect(() => {
    if (loading == false) {
      setIsLoading(false);
    }
  }, [loading]);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={theme.droidSafeArea}>
        <View style={theme.container}>
          <StatusBar barStyle="dark-content" />
          <RegistrationStatusBar step={1} />
          <View style={styles.backButton}>
            <HeaderLeftComponent params={{ isGoBack: true }} />
          </View>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView
              style={styles.form}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 55 : 55}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <View style={styles.contentStyle}>
                  <Text h1>{translate("LetGetStarted")}</Text>
                  <Text
                    style={{
                      color: "gray",
                      fontSize: 16,
                      textAlign: "center",
                      paddingHorizontal: 50,
                      // lineHeight: 24,
                    }}
                  >
                    {translate("EnterMobileNumber")}{" "}
                  </Text>
                  <Text style={{ color: "gray", fontSize: 16, marginTop: 5 }}>
                    or{" "}
                    <Text
                      onPress={openRecoveryScreen}
                      style={{ color: "#ea5284" }}
                    >
                      {translate("RecoverExistingAccount")}
                    </Text>
                  </Text>

                  <View style={{ flexDirection: "row", paddingTop: 30 }}>
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("SearchCountryCode")}
                      >
                        <Text style={{ color: "grey", fontSize: 14 }}>
                          {translate("Country")}
                        </Text>
                        <View style={styles.viewNationalityStyle}>
                          <TextInput
                            pointerEvents="none"
                            // placeholder="+00"
                            // placeholderTextColor="rgba(0,0,0,0.3)"
                            style={styles.input}
                            editable={false}
                            value={countryCode}
                            keyboardType="numeric"
                            underlineColorAndroid="transparent"
                            {...Platform.select({
                              ios: {
                                autoCorrect: false,
                                textContentType: "Username",
                              },
                            })}
                          />
                          <View style={styles.viewIconStyle}>
                            <Icon name="angle-down" type="font-awesome" />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3 }}>
                      <Text
                        style={{
                          color: onFocusPhone ? "#ea5284" : "grey",
                          fontSize: 14,
                        }}
                      >
                        {translate("PhoneNumber")}
                      </Text>
                      <TextInput
                        placeholderTextColor="rgba(0,0,0,0.3)"
                        style={[
                          styles.input,
                          onFocusPhone ? styles.borderColorStyle : null,
                        ]}
                        underlineColorAndroid="transparent"
                        keyboardType="numeric"
                        value={userPhone}
                        onChangeText={(text) => setUserPhone(text)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        {...Platform.select({
                          ios: {
                            autoCorrect: false,
                            textContentType: "Username",
                          },
                        })}
                      />
                    </View>
                  </View>
                  <View>
                    {!isValid && userPhone.length > 8 && (
                      <Text style={{ color: "red" }}>
                        {translate("PhoneInvalid")}
                      </Text>
                    )}
                    {smsError.data && smsError.data.Error && isValid && (
                      <Text style={{ color: "red" }}>
                        {smsError.data.Error}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    width: "100%",
                    marginBottom: isIphoneXorAbove() ? 0 : 20,
                  }}
                >
                  <Button
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                      colors: ["#FF6195", "#C2426C"],
                      start: { x: 0, y: 0.5 },
                      end: { x: 1, y: 0.5 },
                    }}
                    title={translate("Continue").toUpperCase()}
                    titleStyle={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "700",
                      fontFamily: "Lato",
                    }}
                    disabled={!isValid || userPhone.length < 9}
                    disabledStyle={{ opacity: 0.4 }}
                    disabledTitleStyle={{ color: "#fff", opacity: 1 }}
                    onPress={handleContiue}
                    buttonStyle={styles.buttonStyle}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          {renderLoading()}
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    width: "100%",
    minHeight: 40,
    color: "#000",
  },
  form: {
    flex: 1,
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
  },
  buttonStyle: {
    alignSelf: "center",
    paddingVertical: 15,
    // width: "100%",
    // height: 45,
  },
  contentStyle: {
    flex: 1,
    alignItems: "center",
  },
  borderColorStyle: {
    borderColor: "#ea5284",
  },
  viewNationalityStyle: {
    flexDirection: "row",
  },
  viewIconStyle: {
    position: "absolute",
    right: 10,
    top: Platform.OS == "android" ? "30%" : "20%",
    opacity: 0.3,
  },

  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    countryCode: state.registration.userInfo.code.code,
    countryFlag: state.registration.userInfo.code.image,
    userPhone: state.registration.userInfo.phone,
    smsError: state.registration.smsError,
    loading: state.registration.loading,
  };
};

export default connect(
  mapStateToProps,
  { setUserPhone, createUserAccount, showLoading }
)(PhoneNumberScreen);
