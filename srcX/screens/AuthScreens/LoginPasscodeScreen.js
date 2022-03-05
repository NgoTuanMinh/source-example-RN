import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  BackHandler,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { ThemeProvider, Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import * as Keychain from "react-native-keychain";
import theme from "../../styles/themeStyles";
import {
  verifyLoginPasscode,
  checkCurrentDevice,
} from "../../redux/actions/index.js";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { translate } from "../../../App";
import { blockAndroidBackButton } from "../../halpers/android";
import FingerprintScanner from "react-native-fingerprint-scanner";
import NavigationService from "../../NavigationService";

const heightWindown = Dimensions.get("window").height;
const widthWindown = Dimensions.get("window").width;

const LoginPasscodeScreen = (props) => {
  const { verifyLoginPasscode, auth, navigation, checkCurrentDevice } = props;

  // use state form containing inputed value
  const [passCode, setPassCode] = useState("");
  const hiddenInput = useRef(null);
  const [isShowPassCode, setIsShowPassCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let passArray = [0, 1, 2, 3];

  const scanFingerprint = () => {
    FingerprintScanner.authenticate({
      description: "Scan your fingerprint on the device scanner to continue",
    })
      .then(async function(res) {
        FingerprintScanner.release();
        const credentials = await Keychain.getGenericPassword();
        const pinFromKeychain = credentials.password;
        if (pinFromKeychain) {
          verifyLoginPasscode(pinFromKeychain);
        }
      })
      .catch((error) => {
        if (
          error.message &&
          error.message.includes("was canceled by the user")
        ) {
          hiddenInput.current && hiddenInput.current.focus();
        }
      });
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", blockAndroidBackButton);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        blockAndroidBackButton
      );
    };
  }, []);

  useEffect(() => {
    getPublicKey();
    checkEnrollment();
  }, []);

  const checkEnrollment = async () => {
    const faceIdEnabled = await getDataKeystore("@faceIdEnabled");
    if (faceIdEnabled) {
      const fingerprints = await LocalAuthentication.isEnrolledAsync();
      if (fingerprints) {
        scanFingerprint();
        return;
      }
    }
  };

  useEffect(() => {
    if (passCode.length >= passArray.length) {
      setPassCode("");
      verifyLoginPasscode(passCode);
    }
  }, [passCode]);
  /*
        we use the same component from twe screen
        so we need different values
        in this object we contain all this different values
    */
  const currentScreenInfo = {
    title: "WELLCOME_BACK",
    description: "EnterPasscode",
    statusBarStep: 4,
    isAutoFocus: true,
  };

  const _onRecoverAccount = () => {
    let params = { phoneNumberScreen: true, isWellComeBack: true };
    navigation.navigate("RecoverAccountScreen", params);
  };

  const getPublicKey = async () => {
    const reLogin = await getDataKeystore("@reLogin");
    //if (publicKey) {
    if (reLogin == "false" || !reLogin) {
      setIsShowPassCode(true);
    }
    //}
  };

  const openKeyBoard = async () => {
    setIsLoading(true);
    checkCurrentDevice();
    setIsLoading(false);
    setTimeout(() => {
      hiddenInput.current && hiddenInput.current.focus();
    }, 0);
  };

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={style.loadingViewStyle}>
        <ActivityIndicator size="large" color="#EA5284" />
      </View>
    );
  };

  return (
    <View style={style.container}>
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={{
          width: widthWindown,
          height: heightWindown,
          justifyContent: "center",
        }}
        resizeMode="stretch"
      >
        <ThemeProvider theme={theme}>
          <SafeAreaView style={theme.droidSafeArea}>
            <NavigationEvents onDidFocus={openKeyBoard} />
            <KeyboardAvoidingView
              style={style.form}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
              keyboardVerticalOffset="30"
            >
              <View style={style.passcodeInput}>
                <View style={style.contentStyle}>
                  <Text h1 h1Style={style.titleStyle}>
                    {translate(currentScreenInfo.title)}
                  </Text>
                  <Text style={{ color: "#ffffff", opacity: 0.4 }}>
                    {translate(currentScreenInfo.description)}
                  </Text>
                  {auth.authPending ? (
                    <View style={{ paddingTop: 50 }}>
                      <Text style={{ color: "#ffffff" }}>
                        {translate("VerificationProgress")}
                      </Text>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        //onPress={toogleKeyBoard}
                        style={[style.holder, { paddingTop: 20 }]}
                      >
                        {passArray.map((item) => {
                          // check is there more characters in field, then set styles for each
                          const itemStyles =
                            item >= passCode.length
                              ? style.tap
                              : [style.tap, style.filled];
                          const itemGradient =
                            item >= passCode.length
                              ? ["rgba(0, 0, 0, 0.4)", "rgba(0, 0, 0, 0.4)"]
                              : ["#fff", "#fff"];
                          return (
                            <View key={item}>
                              <LinearGradient
                                colors={itemGradient}
                                style={itemStyles}
                              />
                            </View>
                          );
                        })}
                        <TextInput
                          style={style.textInputStyle}
                          keyboardType="numeric"
                          ref={hiddenInput}
                          value={passCode}
                          //autoFocus
                          onChangeText={(value) => setPassCode(value)}
                        />
                      </TouchableOpacity>
                      {auth.authFailed && !auth.auth.NoKeyStorePublicKey && (
                        <View>
                          <Text style={{ color: "#fff" }}>
                            {translate("WrongPassCode")}
                          </Text>
                        </View>
                      )}
                      {auth.authFailed && auth.auth.NoKeyStorePublicKey && (
                        <View style={{ marginTop: 30, alignItems: "center" }}>
                          <Text style={{ color: "#fff" }}>
                            {translate("UsernameAbsent")}
                          </Text>
                          <Text style={{ color: "#fff" }}>
                            {translate("ContactHere")}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {/* {isShowPassCode && ( */}
                <Text onPress={_onRecoverAccount} style={style.forgotStyle}>
                  {translate("RecoverAccount")}
                </Text>
                {/* )} */}
              </View>
            </KeyboardAvoidingView>
            {renderLoading()}
          </SafeAreaView>
        </ThemeProvider>
      </ImageBackground>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.registration,
  };
};

export default connect(
  mapStateToProps,
  { verifyLoginPasscode, checkCurrentDevice }
)(LoginPasscodeScreen);

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  wrapperLoading: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
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
  },
  passcodeInput: {
    flex: 1,
  },
  titleStyle: {
    color: "#fff",
  },
  contentStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: "20%",
  },
  forgotStyle: {
    flex: Platform.OS == "android" ? 0.15 : 0.05,
    textAlign: "center",
    minHeight: 25,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    color: "#fff",
  },
  textInputStyle: {
    height: 40,
    borderColor: "gray",
    width: 40 * 4,
    opacity: 0,
    //backgroundColor: 'green',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingViewStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    opacity: 0.5,
  },
});
