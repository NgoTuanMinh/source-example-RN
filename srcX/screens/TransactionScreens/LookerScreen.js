import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ThemeProvider, Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import * as Keychain from "react-native-keychain";
import theme from "../../styles/themeStyles";
import { reVerifyLoginPasscode } from "../../redux/actions/index.js";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { translate } from "../../../App";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { checkCurrentDevice } from "../../redux/actions/index.js";
import { Icon } from "react-native-elements";
import NavigationService from "../../NavigationService";

const heightWindown = Dimensions.get("window").height;
const widthWindown = Dimensions.get("window").width;

const LookerScreen = (props) => {
  const { reVerifyLoginPasscode, auth, navigation, checkCurrentDevice } = props;

  // use state form containing inputed value
  const [passCode, setPassCode] = useState("");
  const [isFail, setFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hiddenInput = useRef(null);

  const submitToken = navigation.state.params.submitToken;

  let passArray = [0, 1, 2, 3];

  const scanFingerprint = () => {
    try {
      FingerprintScanner.authenticate({
        description: "Scan your fingerprint on the device scanner to continue",
      })
        .then(async function() {
          const credentials = await Keychain.getGenericPassword();
          const pinFromKeychain = credentials.password;
          if (pinFromKeychain) {
            setIsLoading(true);
            reVerifyLoginPasscode(pinFromKeychain, onCallBack);
          } else {
            hiddenInput.current && hiddenInput.current.focus();
          }
        })
        .catch((error) => {
          hiddenInput.current && hiddenInput.current.focus();
        });
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      FingerprintScanner.release();
    };
  }, []);

  const onGoBack = () => {
    navigation.goBack();
  };

  const fetchData = async () => {
    checkCurrentDevice();
    checkEnrollment();
  };

  async function checkEnrollment() {
    const faceIdEnabled = await getDataKeystore("@faceIdEnabled");
    if (faceIdEnabled) {
      let fingerprints = await LocalAuthentication.isEnrolledAsync();

      if (fingerprints) {
        scanFingerprint();
        return;
      }
    }
    hiddenInput.current && hiddenInput.current.focus();
  }

  useEffect(() => {
    if (passCode.length >= passArray.length) {
      setPassCode("");
      setIsLoading(true);
      reVerifyLoginPasscode(passCode, onCallBack);
    } else {
      setFail(false);
    }
  }, [passCode]);

  const onCallBack = (isSuccess) => {
    setIsLoading(false);
    setFail(!isSuccess);

    if (isSuccess) {
      submitToken();
      onGoBack();
    }
  };

  const currentScreenInfo = {
    title: "",
    description: "EnterPasscode",
    statusBarStep: 4,
    isAutoFocus: true,
  };

  const toogleKeyBoard = () => {
    hiddenInput.current && hiddenInput.current.focus();
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      style={{
        width: widthWindown,
        height: heightWindown,
        resizeMode: "cover",
        justifyContent: "center",
      }}
    >
      <SafeAreaView style={style.passcodeInput}>
        <TouchableOpacity style={style.iconBackStyle} onPress={onGoBack}>
          <Icon name="arrowleft" type="antdesign" color="#fff" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={style.form}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset="30"
        >
          <View style={style.passcodeInput}>
            <View style={style.contentStyle}>
              <Text style={{ color: "#ffffff", opacity: 0.4 }}>
                {translate(currentScreenInfo.description)}
              </Text>
              {isLoading ? (
                <View style={{ paddingTop: 50 }}>
                  <Text style={{ color: "#ffffff" }}>
                    {translate("VerificationProgress")}
                  </Text>
                </View>
              ) : (
                <>
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
                    //autoFocus={true}
                    onChangeText={(value) => setPassCode(value)}
                  />
                  <TouchableOpacity
                    onPress={toogleKeyBoard}
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
                  </TouchableOpacity>
                </>
              )}
              {isFail && (
                <View>
                  <Text style={{ color: "#fff", marginTop: 10 }}>
                    {translate("WrongPassCode")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.registration,
  };
};

export default connect(
  mapStateToProps,
  { reVerifyLoginPasscode, checkCurrentDevice }
)(LookerScreen);

const style = StyleSheet.create({
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
    paddingTop: "25%",
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
  iconBackStyle: {
    position: "absolute",
    left: 15,
    top: "6%",
    height: 35,
    width: 35,
    borderRadius: 20,
    //backgroundColor: '#ebeaef',
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
