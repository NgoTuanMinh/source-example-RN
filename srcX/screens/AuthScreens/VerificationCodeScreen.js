import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { ThemeProvider, Text } from "react-native-elements";
import theme from "../../styles/themeStyles";
import {
  verifyUserAccount,
  sendSMS,
  resetCode,
} from "../../redux/actions/index";
import { translate } from "../../../App";
import HeaderLeftComponent from "../../components/HeaderComponent/HeaderLeftComponent";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { getDataKeystore } from "../../redux/actions/keyStore";
let pinCode = {};

const CELL_COUNT = 6;

const VerificationCodeScreen = (props) => {
  const {
    countryCode,
    userPhone,
    verifyUserAccount,
    pinFailed,
    keypair,
    resetCode,
  } = props;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [countDown, setCountDown] = useState(59);
  // const [props, getCellOnLayoutHandler] = useClearByFocusCell({
  //   value,
  //   setValue,
  // });
  let clearInter = null;
  const changeHandlerNew = (value) => {
    resetCode();
    setValue(value);
    if (value.length === 6) {
      let phoneNumber = countryCode + userPhone;
      verifyUserAccount(value, phoneNumber);
    }
  };

  const renderCellInputCode = ({ index, symbol, isFocused }) => {
    return (
      <View
        //onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[
          styles.cellRoot,
          isFocused && styles.focusCell,
          pinFailed && styles.pinCodeFailed,
        ]}
      >
        <Text style={styles.cellText}>
          {symbol || (isFocused ? <Cursor style={{ color: "#cccc" }} /> : null)}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    return () => {
      resetCode();
    };
  }, []);

  useEffect(() => {
    if (pinFailed == 1) {
      setValue("");
    }
  }),
    [pinFailed];

  useEffect(() => {
    clearInter = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    if (countDown < 1) {
      clearInterval(clearInter);
    }
    return () => {
      clearInterval(clearInter);
    };
  }, [countDown]);

  const renderTextFooter = () => {
    let rs = `No code received? You can \nresend the code if it doesn't arrive in ${countDown} seconds`;

    if (countDown === 0) {
      rs = "No code received? ";
    }
    return rs;
  };

  const renderTextResend = () => {
    return "Resend code";
  };

  const handleResend = async () => {
    try {
      let publicKey = props.navigation.state.params.publicKey;
      const response = await sendSMS(publicKey);
      if (response.success) {
        setCountDown(59);
        setValue("");
      } else {
        Alert.alert(
          "Alert",
          "Can not submit the request. Please try again!",
          [{ text: "OK", onPress: () => setValue("") }],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.log("handleResend", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={theme.droidSafeArea}>
        <View style={theme.container}>
          <RegistrationStatusBar step={2} />
          <View style={styles.backButton}>
            <HeaderLeftComponent params={{ isGoBack: true }} />
          </View>
          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 50}
          >
            <View style={{ alignItems: "center" }}>
              <Text h1>{translate("Entercode")}</Text>
              <Text style={{ opacity: 0.4 }}>
                {translate("CodeSent")} {countryCode} {userPhone}
              </Text>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  //width: 180,
                  paddingTop: 30,
                }}
              >
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={(value) => {
                    changeHandlerNew(value);
                  }}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  //autoFocus={true}
                  renderCell={renderCellInputCode}
                />
              </View>
              {pinFailed == 1 && (
                <View>
                  <Text style={styles.error}>{translate("WrongCode")}</Text>
                </View>
              )}
            </View>

            <Text
              style={{
                textAlign: "center",
                color: "gray",
                fontSize: 14,
                bottom: 20,
              }}
            >
              {renderTextFooter()}{" "}
              {countDown === 0 && (
                <Text
                  onPress={() => handleResend()}
                  style={{ color: "#4487C6" }}
                >
                  {renderTextResend()}
                </Text>
              )}
            </Text>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    countryCode: state.registration.userInfo.code.code,
    userPhone: state.registration.userInfo.phone,
    pinFailed: state.registration.pinFailed,
    keypair: state.registration.keypair,
  };
};

export default connect(
  mapStateToProps,
  { verifyUserAccount, resetCode }
)(VerificationCodeScreen);

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 32,
    minHeight: 40,
    minWidth: 19,
    paddingBottom: 5,
    color: "#000",
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  error: {
    color: "#EB5757",
    fontSize: 16,
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 15,
  },
  codeFieldRoot: {
    width: "65%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    minWidth: 30,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
  },
  cellText: {
    color: "#000",
    fontSize: 32,
    textAlign: "center",
    fontWeight: "normal",
    marginBottom: 10,
  },
  focusCell: {
    borderBottomWidth: 2,
  },
  pinCodeFailed: {
    borderBottomColor: "#EB5757",
  },
});
