import React from "react";
import { connect } from "react-redux";
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  // SafeAreaView,
  Platform,
} from "react-native";

import { Button, ThemeProvider, Icon } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import theme from "../../styles/themeStyles";
import Logo from "../../components/Icons/TabIcons/Logo";
import { fixDecimals } from "../../halpers/utilities";
import * as Images from "../../components/Icons/CircleIcons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TopUpSendSuccess = ({ navigation }) => {
  const onBack = () => {
    navigation.navigate("WalletsStack");
  };

  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //   }}
    // >
    <ThemeProvider theme={theme}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <LinearGradient
          colors={["#fff", "#fff"]}
          style={styles.linearGradientStyles}
        >
          <View style={theme.container}>
            <StatusBar barStyle="dark-content" />
            {/* <TouchableOpacity onPress={onBack} style={styles.viewIconStyle}>
              <Icon name="close" color="black" type="antdesign" />
            </TouchableOpacity> */}

            <View style={styles.viewParentStyles}>
              <View style={styles.viewChildStyles}>
                <Image
                  source={require("../../../assets/images/icSuccess.png")}
                  style={styles.imageStyles}
                />
                <Text style={styles.txtTokenStyle}>TOKENS SENT</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.textStyles}>You’ve just sent </Text>
                  <Text
                    style={[
                      styles.textStyles,
                      {
                        fontWeight: "bold",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {/* <Logo color="rgba(0, 0, 0, 0.4)" height={10} width={11} />
                    {`${fixDecimals(navigation.state.params.amount)}`}
                    <Text style={styles.textStyles}>
                      {fixDecimals(navigation.state.params.amount)}
                    </Text> */}
                    <Image
                      source={Images.union}
                      style={{ width: 11, height: 12 }}
                    />
                    <Text
                      style={{
                        color: "rgba(0, 0, 0, 0.4)",
                        lineHeight: 19,
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      {fixDecimals(navigation.state.params.amount)}
                    </Text>
                  </Text>
                  <Text style={styles.textStyles}>
                    {" "}
                    {`to ${navigation.state.params.firstName.trim()}.`}
                  </Text>
                </View>
                {/* <Text style={styles.textStyles}>{`You’ve just sent  X${navigation.state.params.amount} to ${navigation.state.params.reciveName}.`}</Text> */}
              </View>
            </View>
            <Button
              buttonStyle={styles.buttons}
              title="BACK TO HOME"
              onPress={onBack}
              type="clear"
              titleStyle={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
              }}
            />
          </View>
        </LinearGradient>
      </SafeAreaView>
    </ThemeProvider>
    // </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  tokensUp: state.tokens.topUp,
});

export default connect(
  mapStateToProps,
  () => ({})
)(TopUpSendSuccess);

const styles = StyleSheet.create({
  buttons: { backgroundColor: "#FF6195", paddingVertical: 15 },
  linearGradientStyles: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
    paddingBottom: 30,
  },
  viewParentStyles: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
  },
  viewChildStyles: {
    flexGrow: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyles: {
    width: 74,
    height: 74,
    paddingTop: 10,
    resizeMode: "contain",
  },
  textStyles: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.4)",
  },
  viewIconStyle: {
    position: "absolute",
    top: 50,
    left: 15,
    height: 45,
    width: 45,
  },
  txtTokenStyle: {
    fontSize: 24,
    fontFamily: "Lato",
    marginVertical: 10,
    marginTop: 30,
    fontWeight: "bold",
  },
});
