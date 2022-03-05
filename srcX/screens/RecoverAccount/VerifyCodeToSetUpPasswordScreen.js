import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { Text } from "react-native-elements";
import { HeaderCustomComponent } from "../Secutity/SecurityScreen";
import {
  onResetRecoverAccount,
  onReSetWrongPassCose,
  verifyRecoveryCode,
} from "../../redux/actions/recoverAccountAction";
import { bindActionCreators } from "redux";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { translate } from "../../../App";
import { verifyUserAccount } from "../../redux/actions/index";
import * as Images from "../../components/Icons/CircleIcons";

let pinCode = {};
const CELL_COUNT = 6;

function VerifyCodeToSetUpPasswordScreen(props) {
  const {
    verifyRecoveryCode,
    navigation,
    recoverAccount,
    onResetRecoverAccount,
    onReSetWrongPassCose,
    passcodeEmail,
  } = props;

  const [countDown, setCountDown] = useState(59);

  let clearInter = null;
  const phoneNumber = navigation?.state?.params?.phoneNumber || false;
  const email = navigation?.state?.params?.email || false;
  const handleVerify = navigation?.state?.params?.handleVerify || false;
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const isFromPhoneNumberScreen =
    navigation?.state?.params?.isFromPhoneNumberScreen || false;

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

  useEffect(() => {
    if (recoverAccount.isVerifyRecoverSMS == 0) {
      return;
    }
    if (recoverAccount.isVerifyRecoverSMS == 1) {
      resetInputEnterPassCode();
      return;
    }
    if (recoverAccount.isVerifyRecoverSMS === 2) {
      navigation.navigate("NewPassCode");
    }
    return () => {
      _onResetRecoverAccount();
    };
  }, [recoverAccount.isVerifyRecoverSMS]);

  const _onResetRecoverAccount = async () => {
    resetInputEnterPassCode();
    onResetRecoverAccount();
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

  useEffect(() => {
    if (passcodeEmail && !phoneNumber) {
      changeHandlerNew(passcodeEmail);
    }
  }, [passcodeEmail]);

  const changeHandlerNew = (value) => {
    onReSetWrongPassCose();
    setValue(value);
    if (value.length === 6) {
      const to = phoneNumber ? phoneNumber : email;
      const isEmail = phoneNumber ? false : true;
      verifyRecoveryCode(to, value, isEmail);
    }
  };

  const renderCellInputCode = ({ index, symbol, isFocused }) => {
    return (
      <View
        // onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[
          styles.cellRoot,
          isFocused && styles.focusCell,
          recoverAccount.isVerifyRecoverSMS == 1 && styles.pinCodeFailed,
        ]}
      >
        <Text
          style={[
            styles.cellText,
            recoverAccount.isVerifyRecoverSMS == 1 && styles.pinCodeFailed,
          ]}
        >
          {symbol || (isFocused ? <Cursor style={{ color: "#cccc" }} /> : null)}
        </Text>
      </View>
    );
  };

  const onPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <HeaderCustomComponent title={"RECOVER ACCOUNT"} onPress={onPress} />
      <View style={styles.container}>
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
            {recoverAccount.isVerifyRecoverSMS == 1 && (
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
              marginBottom: Platform.OS == "android" ? 30 : 15,
            }}
          >
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
    recoverAccount: state.recoverAccount,
    passcodeEmail: state.registration.passcodeEmail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyRecoveryCode: bindActionCreators(verifyRecoveryCode, dispatch),
    onResetRecoverAccount: bindActionCreators(onResetRecoverAccount, dispatch),
    onReSetWrongPassCose: bindActionCreators(onReSetWrongPassCose, dispatch),
    verifyUserAccount: bindActionCreators(verifyUserAccount, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyCodeToSetUpPasswordScreen);

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
  },
  container: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    flexDirection: "column",
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
  icBack: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
});
