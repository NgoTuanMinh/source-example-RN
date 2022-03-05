import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { translate } from "../../../App";
import HeaderLeftComponent from "../../components/HeaderComponent/HeaderLeftComponent";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const SetFullNameScreen = (props) => {
  const { navigation } = props;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paddingTop, setPaddingTop] = useState("10%");
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener("keyboardDidShow", () =>
      checkKeyboard(true)
    );
    keyboardHideListener.current = Keyboard.addListener("keyboardDidHide", () =>
      checkKeyboard(false)
    );
    return () => {
      keyboardShowListener.current.remove();
      keyboardHideListener.current.remove();
    };
  }, []);

  const checkKeyboard = (isShow) => {
    if (isShow) {
      setPaddingTop("5%");
    } else {
      setPaddingTop("10%");
    }
  };

  const [isFocus, setIsFocus] = useState({
    isFirst: false,
    isLast: false,
  });

  const gray = "gray";
  // const gray = "rgba(0, 0, 0, 0.4)";
  const gray_02 = "rgba(0, 0, 0, 0.2)";
  const primary = "#EA5284";

  const _onContinue = () => {
    const params = {
      firstName,
      lastName,
    };
    navigation.navigate("SetDateOfBirth", params);
  };

  const checkDisableBtnContinue = () => {
    let check = true;
    if (firstName.trim().length > 0 && lastName.trim().length > 0) {
      check = false;
    }
    return check;
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <RegistrationStatusBar step={3} />
        <View style={styles.backButton}>
          <HeaderLeftComponent params={{ isGoBack: true }} />
        </View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 55 : 20}
          >
            {/* <View
              style={{
                flex: 1,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "red",
              }}
            > */}
            <View style={[styles.contentStyle, { marginTop: paddingTop }]}>
              <Text style={styles.textHeader}> ENTER YOUR LEGAL NAME</Text>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={[
                    styles.textLabelInput,
                    {
                      color: isFocus.isFirst ? primary : gray,
                    },
                  ]}
                >
                  First name(s)
                </Text>

                <TextInput
                  onEndEditing={() =>
                    setIsFocus({ ...isFocus, isFirst: false })
                  }
                  onFocus={() => setIsFocus({ ...isFocus, isFirst: true })}
                  style={[
                    styles.input,
                    { borderColor: isFocus.isFirst ? primary : gray_02 },
                  ]}
                  onChangeText={(text) => setFirstName(text)}
                  autoFocus={true}
                  {...Platform.select({
                    ios: {
                      autoCorrect: false,
                      textContentType: "Username",
                    },
                  })}
                />
                {/* </View>

                <View style={{ marginTop: 10 }}> */}
                <Text
                  style={[
                    styles.textLabelInput,
                    { color: isFocus.isLast ? primary : gray, marginTop: 10 },
                  ]}
                >
                  Last name
                </Text>

                <TextInput
                  onEndEditing={() => setIsFocus({ ...isFocus, isLast: false })}
                  onFocus={() => setIsFocus({ ...isFocus, isLast: true })}
                  style={[
                    styles.input,
                    { borderColor: isFocus.isLast ? primary : gray_02 },
                  ]}
                  onChangeText={(text) => setLastName(text)}
                  returnKeyType="done"
                  {...Platform.select({
                    ios: {
                      autoCorrect: false,
                      textContentType: "Username",
                    },
                  })}
                />
              </View>
            </View>
            <View
              style={{
                width: "100%",
                marginBottom: isIphoneXorAbove() ? 0 : 20,
              }}
            >
              <Button
                buttonStyle={styles.buttonStyle}
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
                disabledTitleStyle={{ color: "white" }}
                disabledStyle={{ opacity: 0.4 }}
                disabled={checkDisableBtnContinue()}
                onPress={_onContinue}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
};

export default SetFullNameScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    backgroundColor: "#fff",
  },
  textHeader: {
    fontSize: 24,
    fontWeight: "bold",
  },
  droidSafeArea: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 16,
    color: "#000",
    width: deviceWidth * 0.9,
    height: 45,
  },
  contentStyle: {
    flex: 1,
    alignItems: "center",
  },
  textLabelInput: {
    fontSize: 14,
    fontFamily: "Lato",
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
    marginTop: 15,
  },
  buttonStyle: {
    width: deviceWidth * 0.9,
    alignSelf: "center",
    paddingVertical: 15,
  },
  form: {
    flex: 1,
    // backgroundColor: "blue",
  },
});
