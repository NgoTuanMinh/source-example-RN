import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ThemeProvider, Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { NavigationEvents } from "react-navigation";
import theme from "../../styles/themeStyles";
import {
  onResetRecoverAccount,
  onSetupNewPasscode,
  insertIdDevice,
} from "../../redux/actions/recoverAccountAction";
import { getVaultSecretKeyFlow } from "../../redux/actions";
import { bindActionCreators } from "redux";
import { translate } from "../../../App";
import { AESDecrypt, AESEncrypt } from "../../utils/EncryptSecretKey";
import { storeKey, resetKeyStore } from "../../redux/actions/keyStore";
import { HeaderCustomComponent } from "../Secutity/SecurityScreen";

let passArray = [0, 1, 2, 3];

const NewPassCodeScreen = ({
  navigation,
  onSetupNewPasscode,
  recoverAccount,
  onResetRecoverAccount,
}) => {
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const hiddenInput = useRef(null);
  let confirm = false;
  let prevValue = null;
  if (navigation.state.params) {
    confirm = navigation.state.params.confirm;
    prevValue = navigation.state.params.prevValue;
  }
  //const passwordMemonic = navigation?.state?.params?.passwordMemonic || "";

  const openKeyBoard = () => {
    setTimeout(() => {
      hiddenInput.current && hiddenInput.current.focus();
    }, 50);
  };

  const showKeyBoard = () => {
    Keyboard.dismiss();
    openKeyBoard();
  };

  useEffect(() => {
    if (passCode.length >= passArray.length) {
      setPassCode("");
      if (confirm) {
        if (passCode === prevValue) {
          setLoading(true);
          _onSetupNewPasscode(passCode);
        } else {
          confirmFuc();
        }
      } else {
        navigation.navigate("ConfirmNewPassCode", {
          confirm: true,
          prevValue: passCode,
        });
      }
    }
  }, [passCode]);

  const confirmFuc = () => {
    Alert.alert(
      translate("WrongPasscodeInput"),
      "Try again or go back?",
      [
        { text: "Try again", onPress: () => {} },
        {
          text: "Go back",
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const _onSetupNewPasscode = async (passCode) => {
    try {
      let keycloarkId = "";
      let id = "";
      let recoveryHashKey =
        recoverAccount.accountRecoveryNonPublicKey.recoveryHashKey;
      if (recoverAccount.accountRecoveryNonPublicKey) {
        keycloarkId = recoverAccount.accountRecoveryNonPublicKey.keycloarkId;
        id = recoverAccount.accountRecoveryNonPublicKey.id;
      }
      onSetupNewPasscode(passCode, keycloarkId, id, recoveryHashKey);
    } catch (error) {
      console.log("error _onSetupNewPasscode", error);
    }
  };

  useEffect(() => {
    if (recoverAccount.isSetPasscodeRecovery.success === true) {
      updateRecoveryAccountNonPublicKey(
        recoverAccount.isSetPasscodeRecovery.secretKey
      );
    } else {
      if (
        recoverAccount.isSetPasscodeRecovery.data &&
        recoverAccount.isSetPasscodeRecovery.data.Error
      ) {
        alert(recoverAccount.isSetPasscodeRecovery.data.Error);
      }
    }
    return () => {
      _onResetRecoverAccount();
    };
  }, [recoverAccount.isSetPasscodeRecovery]);

  const _onResetRecoverAccount = async () => {
    setPassCode("");
    onResetRecoverAccount();
  };

  const updateRecoveryAccountNonPublicKey = async (secretKey) => {
    try {
      console.log("Update here", recoverAccount.accountRecoveryNonPublicKey);
      await resetKeyStore();
      await storeKey("@userId", recoverAccount.accountRecoveryNonPublicKey.id);
      let data = {
        firstName: recoverAccount.accountRecoveryNonPublicKey.firstName,
        lastName: recoverAccount.accountRecoveryNonPublicKey.lastName,
        birthDay: recoverAccount.accountRecoveryNonPublicKey.birthday,
        country: {
          countryCode: recoverAccount.accountRecoveryNonPublicKey.nationality,
        },
        nationality: {
          countryCode: recoverAccount.accountRecoveryNonPublicKey.nationality,
        },
      };
      await storeKey("@userName", data);
      await storeKey(
        "@keycloarkId",
        recoverAccount.accountRecoveryNonPublicKey.keycloarkId
      );
      //let secretKeyEncrypted = recoverAccount.accountRecoveryNonPublicKey.account.secretKeyEncrypted
      let publicKey = recoverAccount.accountRecoveryNonPublicKey.id;
      //let descryptSecretkey = await AESDecrypt(passwordMemonic, secretKeyEncrypted)
      await storeKey("@publicKey", publicKey);
      console.log("store secret key===", secretKey);
      await storeKey("@secretKey", secretKey);
      await storeKey(
        "@memonic",
        recoverAccount.accountRecoveryNonPublicKey.recoveryHashKey
      );
      nextScreen(publicKey);
    } catch (error) {}
  };

  const nextScreen = async (publicKey) => {
    //await insertIdDevice(prevValue, publicKey);
    navigation.navigate("RecoverSuccessfully");
  };

  const backHeader = () => {
    navigation.goBack();
  };

  const currentScreenInfo = {
    title: confirm ? "Repeat Passcode" : "Set up your Passcode",
    description: confirm
      ? "Confirm your secret passcode"
      : "Choose your secret passcode",
    statusBarStep: confirm ? 5 : 4,
    isAutoFocus: confirm ? true : false,
  };
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={[theme.droidSafeArea, { backgroundColor: "white" }]}>
        {/* <HeaderCustomComponent title={"RECOVER ACCOUNT"} onPress={backHeader} /> */}
        <NavigationEvents onDidFocus={openKeyBoard} />
        <TouchableWithoutFeedback onPress={showKeyBoard}>
          <KeyboardAvoidingView
            style={style.form}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 60}
          >
            <View style={style.wrapper}>
              <TextInput
                style={{
                  height: 40,
                  borderColor: "gray",
                  minWidth: 50,
                  opacity: 0,
                }}
                keyboardType="numeric"
                ref={hiddenInput}
                value={passCode}
                autoFocus={true}
                onChangeText={(value) => {
                  console.log(value);
                  setPassCode(value);
                }}
                editable={!loading}
                {...Platform.select({
                  ios: {
                    autoCorrect: false,
                    textContentType: "Username",
                  },
                })}
              />

              <View style={{ alignItems: "center", paddingTop: 30 }}>
                <Text h1>{currentScreenInfo.title}</Text>
                <TouchableOpacity
                  onPress={showKeyBoard}
                  style={[style.holder, { paddingTop: 50 }]}
                >
                  {passArray.map((item) => {
                    const itemStyles =
                      item >= passCode.length
                        ? style.tap
                        : [style.tap, style.filled];
                    const itemGradient =
                      item >= passCode.length
                        ? ["rgba(0,0,0,0.2)", "rgba(0,0,0,0.2)"]
                        : ["#FF6195", "#C2426C"];
                    return (
                      <View key={item}>
                        <LinearGradient
                          colors={itemGradient}
                          style={itemStyles}
                        />
                      </View>
                    );
                  })}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ThemeProvider>
  );
};
const style = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  holder: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
  tap: {
    width: 20,
    height: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  filled: {
    backgroundColor: "pink",
  },
  form: {
    flex: 1,
    marginTop: "10%",
  },
});

const mapStateToProps = (state) => {
  return {
    recoverAccount: state.recoverAccount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetupNewPasscode: bindActionCreators(onSetupNewPasscode, dispatch),
    onResetRecoverAccount: bindActionCreators(onResetRecoverAccount, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPassCodeScreen);
