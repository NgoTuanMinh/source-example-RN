import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  StatusBar,
  BackHandler,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button, ThemeProvider, Text } from "react-native-elements";
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from "react-native-linear-gradient";
import theme from "../../styles/themeStyles";
import { fixDecimals } from "../../halpers/utilities";
import Logo from "../../components/Icons/TabIcons/Logo";
import * as Images from "../../components/Icons/CircleIcons";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const RefundSuccess = ({ navigation }) => {
  const handleBackButtonClick = () => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
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
      <View style={styles.viewContentStyle}>
        <Image source={Images.icSuccess} style={styles.icSuccess} />

        <Text style={styles.textNotify}>TOKENS REFUNDED</Text>

        <Text style={styles.txtDetailStyle}>
          Your refund amount should arrive shortly.
        </Text>
      </View>
      <View style={styles.viewBottomStyle}>
        <Button
          buttonStyle={{
            paddingVertical: 15,
            borderRadius: 4,
            // marginBottom: 20,
          }}
          ViewComponent={LinearGradient}
          linearGradientProps={{
            colors: ["#FF6195", "#C2426C"],
            start: { x: 0, y: 0.5 },
            end: { x: 1, y: 0.5 },
          }}
          title="BACK TO HOME"
          titleStyle={{ color: "white", fontSize: 20, fontWeight: "700" }}
          onPress={onBack}
        />
      </View>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  tokensUp: state.tokens.topUp,
});

export default connect(
  mapStateToProps,
  () => ({})
)(RefundSuccess);

const styles = StyleSheet.create({
  txtStyle: {
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 19,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 14,
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
  viewContentStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  icSuccess: {
    width: 74,
    height: 74,
    resizeMode: "contain",
  },
  textNotify: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 25,
    fontSize: 20,
    fontFamily: "Lato",
  },
  txtDetailStyle: {
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 16,
    opacity: 0.4,
  },
  viewBottomStyle: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    marginBottom: 20,
  },
});
