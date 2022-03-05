import React, { useEffect } from "react";
import { connect } from "react-redux";
import { View, Image, StatusBar, SafeAreaView } from "react-native";
import { Button, ThemeProvider, Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import theme from "../../styles/themeStyles";
import { translate } from "../../../App";
import * as NewRelicRN from "../../../NewRelicRN";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";

const FinishRegistrationScreen = ({ navigation, userName }) => {
  useEffect(() => {
    NewRelicRN.nrAddUserId(userName);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LinearGradient
        colors={["#FF6195", "#C2426C"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <SafeAreaView style={theme.droidSafeArea}>
          <View style={theme.container}>
            <StatusBar barStyle="light-content" />
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/undraw_order_confirmed.png")}
                style={{ width: 320, height: 266 }}
              />
            </View>
            <View
              style={{
                flex: 0,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                paddingBottom: 60,
              }}
            >
              <Text h1 style={[{ color: "#fff" }, theme.boldText]}>
                {translate("Welcome")}, {userName}!
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 19,
                  flex: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {translate("WalletCreatedMsg")}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                marginBottom: isIphoneXorAbove() ? 0 : 20,
              }}
            >
              <Button
                title={translate("LetGo")}
                onPress={() => navigation.navigate("Features")}
                type="clear"
                titleStyle={{
                  color: ["rgba(194, 66, 108, 1)", "rgba(255, 97, 149, 1)"],
                  fontSize: 20,
                  fontWeight: "700",
                  fontFamily: "Lato",
                }}
                buttonStyle={{
                  alignSelf: "center",
                  paddingVertical: 15,
                  // marginBottom: 20,
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    userName: state.registration.screenName.firstName,
  };
};

export default connect(mapStateToProps)(FinishRegistrationScreen);
