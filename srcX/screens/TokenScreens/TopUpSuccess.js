import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  StatusBar,
  BackHandler,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, ThemeProvider, Text } from "react-native-elements";
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from "react-native-linear-gradient";
import theme from "../../styles/themeStyles";
import { fixDecimals } from "../../halpers/utilities";
import Logo from "../../components/Icons/TabIcons/Logo";
import CircleIcons from "../../components/Icons/CircleIcons";
import * as ImageSvg from "../../components/Icons/CircleIcons/ImageSvg";
import * as Images from "../../components/Icons/CircleIcons";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const colorsDradient = ["#FF6195", "#C2426C"];

const TopUpSuccess = ({ navigation, tokensUp }) => {
  const handleBackButtonClick = () => {
    return true;
  };

  const [tokenAmout, setTokenAmount] = useState(0);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    const tokenAmountParam = navigation?.state?.params?.tokenAmount;
    setTokenAmount(tokenAmountParam);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const onBack = () => {
    navigation.navigate("WalletsStack");
  };

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#fff", "#fff"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: -1,
          paddingBottom: 30,
        }}
      >
        <View style={theme.container}>
          {/* <StatusBar barStyle="light-content" /> */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "8%",
            }}
          >
            {/* <View
              style={{
                flexGrow: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/undraw_order_confirmed.png")}
                style={styles.iconStyle}
              />
            </View> */}

            <View
              style={{
                flex: 0,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                paddingBottom: 30,
                flexBasis: 140,
              }}
            >
              <Image source={Images.icCheck} style={styles.icSuccess} />
              <Text h1 style={{ color: "#000000", fontWeight: "700" }}>
                TOP-UP SUCCESSFUL
              </Text>
              <View style={styles.viewStyle}>
                <Text style={styles.txtStyle}>
                  {`You’ve successfully topped up your wallet with `}
                  {/* <ImageSvg.IcLogo width={12} height={11} /> */}
                  <Image
                    source={Images.union}
                    style={{ width: 11, height: 12 }}
                  />
                  <Text style={styles.txtStyle}>{fixDecimals(tokenAmout)}</Text>
                  <Text style={styles.txtStyle}>. Way to go!</Text>
                </Text>

                {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <CircleIcons
                    name="logo-regular"
                    color="rgba(255, 255, 255, 0.9)"
                    size={{ width: 12, height: 10 }}
                  />
                  
                  <Text style={{ fontWeight: 'bold', color: "rgba(255, 255, 255, 0.9)" }}>
                    {fixDecimals(tokenAmout)}</Text>
                  <Text style={styles.txtStyle}>. Way to go!</Text>
                </View> */}
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={onBack}
            // style={styles.btnPayStyle}
            style={{
              // paddingVertical: 15,
              paddingTop: 20,
            }}
          >
            <LinearGradient
              colors={colorsDradient}
              style={styles.gradientStyle}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text
                // style={styles.txtPayStyle}
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "700",
                  fontFamily: "Lato",
                  textTransform: "uppercase",
                  marginTop: 0,
                }}
              >
                BACK TO WALLET
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  tokensUp: state.tokens.topUp,
});

export default connect(
  mapStateToProps,
  () => ({})
)(TopUpSuccess);

const styles = StyleSheet.create({
  gradientStyle: {
    width: deviceWidth * 0.9,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "center",
  },
  txtStyle: {
    color: "rgba(0, 0, 0, 0.4)",
    lineHeight: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },
  viewStyle: {
    //height: 150,
    width: deviceWidth * 0.8,
    alignSelf: "center",
    flexDirection: "row",
    //paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    width: deviceWidth * 0.85,
    //paddingTop: 10,
    resizeMode: "contain",
  },
  icSuccess: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
