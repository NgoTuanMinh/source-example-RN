import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  BackHandler,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button, ThemeProvider, Text } from "react-native-elements";
import Logo from "../../components/Icons/Svg/Start-logo";
import theme from "../../styles/themeStyles";
import { blockAndroidBackButton } from "../../halpers/android";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { translate } from "../../../App";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";
let heightWindown = Math.round(Dimensions.get("window").height);
const widthWindown = Math.round(Dimensions.get("window").width);

const StartedScreen = ({ navigation }) => {
  const [account, setAccount] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", blockAndroidBackButton);
    (async function getPublicKey() {
      const publicKey = await getDataKeystore("@publicKey");
      setAccount(publicKey ? true : false);
    })();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/images/background.png")}
      style={{
        width: widthWindown,
        height: heightWindown,
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
      }}
    >
      <ThemeProvider theme={theme}>
        <SafeAreaView style={theme.droidSafeArea}>
          <StatusBar barStyle="light-content" />
          <View style={theme.container}>
            <ThemeProvider theme={theme}>
              <View style={styles.main}>
                <Logo width={83} height={110} />
                <Text h1 style={styles.title}>
                  EVX WALLET
                </Text>
                <Text style={{ opacity: 0.4, color: "white" }}>
                  {translate("PrivateBeta")}
                </Text>
              </View>
              {account && (
                <View style={styles.button}>
                  <Button
                    title={translate("Login")}
                    type="clear"
                    onPress={() => navigation.navigate("Login")}
                  />
                </View>
              )}
              <View
                style={{
                  width: "100%",
                  marginBottom: isIphoneXorAbove() ? 0 : 20,
                }}
              >
                <Button
                  title={translate("GetStarted")}
                  type="clear"
                  onPress={() => navigation.navigate("Phone")}
                  titleStyle={{
                    color: "#FF6195",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                  buttonStyle={{
                    paddingVertical: 15,
                    // backgroundColor: "red",
                  }}
                />
              </View>
            </ThemeProvider>
          </View>
        </SafeAreaView>
      </ThemeProvider>
    </ImageBackground>
  );
};

export default StartedScreen;

const styles = StyleSheet.create({
  backgroundImg: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: "#fff",
    marginTop: 40,
    fontFamily: "Lato-bold",
  },
  button: {
    marginBottom: 100,
    width: 200,
  },
});
