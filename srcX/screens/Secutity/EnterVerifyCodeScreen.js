import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Text } from "react-native-elements";
import { HeaderCustomComponent } from "./SecurityScreen";
import {
  onResetSecurityReducer,
  onSendVerifyCode,
  resetVerifySecuritySMS,
} from "../../redux/actions/securityAction";
import { bindActionCreators } from "redux";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { translate } from "../../../App";
import * as Images from "../../components/Icons/CircleIcons";
import NavigationService from "../../NavigationService";
import { NavigationActions } from "react-navigation";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const CELL_COUNT = 6;

function EnterVerifyCodeScreen(props) {
  const {
    countryCode,
    navigation,
    onResetSecurityReducer,
    securityReducer,
    onSendVerifyCode,
    resetVerifySecuritySMS,
    passcodeEmail,
  } = props;

  const [countDown, setCountDown] = useState(59);
  let clearInter = null;
  const params = navigation?.state?.params;
  const phoneNumber = params?.countryCode + params?.phoneNumber || false;
  const email = navigation?.state?.params?.email || false;
  const handleVerify = navigation?.state?.params?.handleVerify || false;
  const isPayment = navigation?.state?.params?.isPayment || false;
  const selectedData = navigation.state.params.selectedData;
  const isCoreTopup = navigation?.state?.params?.isCoreTopup;
  // console.log("thai topup core", isCoreTopup);

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  // const [getCellOnLayoutHandler] = useClearByFocusCell({
  //   value,
  //   setValue,
  // });

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

  const onPressBack = () => {
    navigation.goBack();
  };

  const onPress = () => {
    if (!phoneNumber) {
      Alert.alert(
        "Eventx visitors",
        "You will be lost access to your account if not authenticating!",
        [
          {
            text: "OK",
            onPress: () => {
              onBack();
            },
          },
          {
            text: "Cannel",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    }
  };

  useEffect(() => {
    if (securityReducer.isVerifySecuritySMS == 0) return;
    if (securityReducer.isVerifySecuritySMS == 1) {
      resetInputEnterPassCode();
      return;
    }

    if (securityReducer.isVerifySecuritySMS == 2) {
      if (phoneNumber) {
        const params = {
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        };
        navigation.navigate("VerifySuccess", params);
      } else {
        const params = {
          email: email,
          isPayment,
          selectedData,
          // isCoreTopup: isCoreTopup,
        };
        navigation.navigate("VerifySuccess", params);
      }
    }

    return () => {
      _onResetSecurityReducer();
    };
  }, [securityReducer.isVerifySecuritySMS]);

  const backAction = NavigationActions.back({
    key: null,
  });

  const onBack = () => {
    if (isPayment) {
      // console.log("thai back", navigation.goBack());
      // navigation.navigate("PaymentScreen", {
      //   selectedData: selectedData,
      // });
      // navigation.dispatch(backAction);
      // navigation.dispatch(backAction);
      if (isCoreTopup == true) {
        navigation.dispatch(backAction);
        navigation.dispatch(backAction);
        return;
      } else {
        navigation.dispatch(backAction);
        navigation.dispatch(backAction);
        navigation.dispatch(backAction);
        return;
      }
    }
    NavigationService.popToTop();
  };

  useEffect(() => {
    if (passcodeEmail) {
      changeHandlerNew(passcodeEmail);
    }
  }, [passcodeEmail]);

  const _onResetSecurityReducer = async () => {
    onResetSecurityReducer();
  };

  const changeHandlerNew = (value) => {
    resetVerifySecuritySMS(0);
    setValue(value);
    if (value.length === 6) {
      const params = {
        code: value,
        via: phoneNumber ? "sms" : "email",
        to: phoneNumber ? phoneNumber : email,
      };
      onSendVerifyCode(params);
    }
  };

  const renderTextFooter = () => {
    let rs = "";
    if (countDown > 0) {
      if (email) {
        rs = `No email received? You can \nresend the code if it doesn't arrive in ${countDown} seconds`;
      } else if (phoneNumber) {
        rs = `No code received? You can \nresend the code if it doesn't arrive in ${countDown} seconds`;
      }
    } else if (countDown === 0) {
      if (email) {
        rs = "No email received? ";
      } else if (phoneNumber) {
        rs = "No code received? ";
      }
    }
    return rs;
  };

  const renderTextResend = () => {
    let rs = "";
    if (email) {
      rs = "Resend the email";
    } else if (phoneNumber) {
      rs = "Resend code";
    }
    return rs;
  };

  const handleResend = () => {
    setCountDown(59);
    resetInputEnterPassCode();
    handleVerify();
  };

  const resetInputEnterPassCode = () => {
    setValue("");
  };

  const renderCellInputCode = ({ index, symbol, isFocused }) => {
    return (
      <View
        //onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[
          styles.cellRoot,
          isFocused && styles.focusCell,
          securityReducer.isVerifySecuritySMS == 1 && styles.pinCodeFailed,
        ]}
      >
        <Text
          style={[
            styles.cellText,
            securityReducer.isVerifySecuritySMS == 1 && styles.pinCodeFailed,
          ]}
        >
          {symbol || (isFocused ? <Cursor style={{ color: "#cccc" }} /> : null)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPressBack} style={styles.btnBack}>
          <Image source={Images.icBack} style={styles.icBack} />
        </TouchableOpacity>

        {!phoneNumber && (
          <TouchableOpacity onPress={onPress} style={styles.btnRightBack}>
            <Text style={styles.txtStyle}>Skip</Text>
          </TouchableOpacity>
        )}

        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 70}
        >
          <View style={{ alignItems: "center", flex: 1, marginTop: "20%" }}>
            <Text style={styles.textEnterCode}>Enter the 6-digit code</Text>
            <Text style={{ opacity: 0.4, marginTop: 20 }}>
              We've sent it to {phoneNumber || email}
            </Text>

            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                width: 180,
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
                autoFocus={true}
                renderCell={renderCellInputCode}
              />
            </View>
            {securityReducer.isVerifySecuritySMS == 1 && (
              <View>
                <Text style={styles.error}>{translate("WrongCode")}</Text>
              </View>
            )}
          </View>

          <Text style={{ textAlign: "center", color: "gray", fontSize: 14 }}>
            {renderTextFooter()}{" "}
            {countDown === 0 && (
              <Text onPress={() => handleResend()} style={{ color: "#4487C6" }}>
                {renderTextResend()}
              </Text>
            )}
          </Text>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state) => {
  return {
    countryCode: state.registration.userInfo.code.code,
    userPhone: state.registration.userInfo.phone,
    securityReducer: state.security,
    pinFailed: state.registration.pinFailed,
    passcodeEmail: state.registration.passcodeEmail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendVerifyCode: bindActionCreators(onSendVerifyCode, dispatch),
    onResetSecurityReducer: bindActionCreators(
      onResetSecurityReducer,
      dispatch
    ),
    resetVerifySecuritySMS: bindActionCreators(
      resetVerifySecuritySMS,
      dispatch
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterVerifyCodeScreen);

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
  },
  error: {
    color: "#EB5757",
    fontSize: 16,
    marginTop: 10,
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 15,
  },
  codeFieldRoot: {
    width: 250,
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
  textEnterCode: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 24,
  },
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 15,
    alignItems: "center",
    flex: 1,
  },
  textTitleHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnBack: {
    position: "absolute",
    zIndex: 1,
    padding: 15,
    left: 15,
    top: 15,
  },
  btnRightBack: {
    position: "absolute",
    zIndex: 1,
    padding: 15,
    right: 15,
    top: 15,
  },
  icBack: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  txtStyle: {
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: "Lato",
  },
});
