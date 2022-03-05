import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Linking,
  StatusBar,
  ScrollView,
} from "react-native";
import { bindActionCreators } from "redux";
import {
  ButtonLinear,
  HeaderCustomComponent,
} from "../Secutity/SecurityScreen";
import { TextField } from "react-native-material-textfield";
import {
  onResetRecoverAccount,
  requestSendRecoveryCode,
  resetRerifyEmailUrl,
  verifyEmailUrl,
} from "../../redux/actions/recoverAccountAction";
import { translate } from "../../../App";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export function validateIsEmail(email) {
  //return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  const re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return re.test(String(email).toLowerCase());
}

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
  return phoneRegex.test(phone);
};

function RecoverAccountScreen(props) {
  const {
    navigation,
    requestSendRecoveryCode,
    onResetRecoverAccount,
    recoverAccount,
    resetRerifyEmailUrl,
    verifyEmailUrl,
  } = props;

  const isFromPhoneNumberScreen =
    navigation?.state?.params?.phoneNumberScreen || false;
  const isWellComeBack = navigation?.state?.params?.isWellComeBack || false;
  const [valueInput, setValueInput] = useState("");
  const [isShowWrongCode, setIsShowWrongCode] = useState(false);
  const inputRef = useRef(null);
  const [checkFocus, setCheckFocus] = useState(false);

  const checkDisableButton = () => {
    let check = true;
    if (validateIsEmail(valueInput) || validatePhone(valueInput)) {
      check = false;
    }
    return check;
  };

  useEffect(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 200);

    Linking.getInitialURL().then((url) => getPassCode(url));
    Linking.addEventListener("url", handleDeepLink);
    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    getPassCode(url);
  };

  const getPassCode = (url) => {
    if (url) {
      const indexOf = url.lastIndexOf("/");
      const passcode = url.slice(indexOf + 1);
      verifyEmailUrl(passcode);
    }
  };

  const _handleSubmit = async () => {
    const isEmail = validateIsEmail(valueInput);
    if (isEmail) {
      resetRerifyEmailUrl();
    }
    requestSendRecoveryCode(valueInput, isEmail);
    setIsShowWrongCode(false);
  };

  const onChangeInput = (txt) => {
    setValueInput(txt.trim());
    if (!isShowWrongCode) setIsShowWrongCode(false);
  };

  useEffect(() => {
    if (recoverAccount.isVerifyRecover === true) {
      if (validateIsEmail(valueInput)) {
        const params = {
          email: valueInput,
          handleVerify: () => _handleSubmit(),
          isFromPhoneNumberScreen: isFromPhoneNumberScreen,
        };
        navigation.navigate("VerifyCodeToSetUpPassword", params);
      } else if (validatePhone(valueInput)) {
        const params = {
          phoneNumber: valueInput,
          handleVerify: () => _handleSubmit(),
          isFromPhoneNumberScreen: isFromPhoneNumberScreen,
        };
        navigation.navigate("VerifyCodeToSetUpPassword", params);
      }
    } else {
      if (recoverAccount.isVerifyRecover.message) {
        setIsShowWrongCode(true);
        //alert(recoverAccount.isVerifyRecover.message)
      }
    }
    return () => {
      _onResetRecoverAccount();
    };
  }, [recoverAccount.isVerifyRecover]);

  const _onResetRecoverAccount = async () => {
    onResetRecoverAccount();
  };

  const backHeader = () => {
    if (!isWellComeBack) {
      navigation.navigate("Phone");
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <HeaderCustomComponent
            title={"RECOVER ACCOUNT"}
            onPress={backHeader}
          />

          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 5}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{ flex: 1, alignItems: "center", paddingHorizontal: 15 }}
              >
                <ScrollView>
                  <Text style={styles.textBody}>LET'S BRING YOU BACK IN</Text>

                  <Text style={styles.textNote}>
                    {`You can recover your account using a previously verified email or phone number`}
                  </Text>

                  <View style={{ marginTop: 20 }}>
                    <Text
                      style={[
                        styles.styleLabel,
                        {
                          color: checkFocus
                            ? checkDisableButton()
                              ? "rgba(235, 87, 87, 1)"
                              : "rgba(234, 82, 132, 1)"
                            : "rgba(234, 82, 132, 1)",
                        },
                      ]}
                    >
                      Email address or phone number
                    </Text>
                    <TextInput
                      value={valueInput}
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: checkDisableButton()
                            ? "rgba(235, 87, 87, 1)"
                            : "rgba(234, 82, 132, 1)",
                        },
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(text) => onChangeInput(text)}
                      autoFocus={true}
                      keyboardType="default"
                      ref={inputRef}
                      onFocus={() => setCheckFocus(true)}
                    />
                  </View>

                  {isShowWrongCode == true || valueInput == "" ? (
                    <View>
                      <Text
                        style={[
                          styles.styleLabel,
                          {
                            color: "rgba(235, 87, 87, 1)",
                          },
                        ]}
                      >
                        Please enter a valid email address or phone number
                      </Text>
                    </View>
                  ) : null}

                  {checkDisableButton() &&
                    valueInput.length > 0 &&
                    !isShowWrongCode && (
                      <Text
                        style={{
                          color: "rgba(235, 87, 87, 1)",
                          // fontSize: 14,
                          width: width - 30,
                        }}
                      >
                        Please enter a valid email address or phone number
                      </Text>
                    )}
                </ScrollView>
              </View>

              <ButtonLinear
                checkDisableButton={checkDisableButton()}
                onPress={_handleSubmit}
                label="SUBMIT"
                style={[
                  styles.buttonSubmit,
                  { opacity: checkDisableButton() ? 0.5 : 1 },
                ]}
                textStyle={styles.textBtnSubmit}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  textBody: {
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Lato",
    alignSelf: "center",
  },
  textNote: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
    opacity: 0.4,
    fontFamily: "Lato",
  },
  buttonSubmit: {
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 15,
    width: width - 30,
    marginTop: 10,
  },
  textBtnSubmit: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Lato",
  },
  inputContainer: {
    borderBottomWidth: 2,

    fontSize: 24,
    width: width - 30,
    minHeight: 40,
    color: "#000",
    marginBottom: 5,
  },
  form: {
    flex: 1,
    paddingTop: "10%",
  },
  styleLabel: {
    fontWeight: "400",
    fontSize: 14,
  },
});

const mapStateToProps = (state) => {
  return {
    recoverAccount: state.recoverAccount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetRecoverAccount: bindActionCreators(onResetRecoverAccount, dispatch),
    requestSendRecoveryCode: bindActionCreators(
      requestSendRecoveryCode,
      dispatch
    ),
    resetRerifyEmailUrl: bindActionCreators(resetRerifyEmailUrl, dispatch),
    verifyEmailUrl: bindActionCreators(verifyEmailUrl, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoverAccountScreen);
