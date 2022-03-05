import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemeProvider, Text, Image } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import { translate } from "../../../App";
import IdealIcon from "../../components/Icons/Svg/IdealIcon";
import iconIdealNew from "../../../assets/images/ic_ideal_new.png";
import theme from "../../styles/themeStyles";

const CarouselScreen = ({ item, slideImage }) => {
  const { title, description, subtitle, hasIcon } = item;

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
        <View style={theme.container}>
          <View style={style.welcomeContainer}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text
                h1
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "700",
                }}
              >
                {translate(title)}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flex: 0,
                  flexDirection: "row",
                }}
              >
                <Text style={{ color: "#fff", alignItems: "center" }}>
                  {translate(subtitle)}
                </Text>
                {/* {hasIcon ? (
                  <View style={{ marginLeft: 10, marginTop: 20 }}>
                    <Image
                      source={iconIdealNew}
                      style={{ resizeMode: "contain", height: 21, width: 24 }}
                    />
                  </View>
                ) : null} */}
              </View>
            </View>
            <View>
              <Image
                source={slideImage}
                style={{ resizeMode: "contain" }}
                style={style.highlightsImg}
              />
            </View>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 24,
                flex: 0,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              {translate(description)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </ThemeProvider>
  );
};

export default CarouselScreen;

const style = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    paddingTop: 50,
    paddingBottom: 130,
  },
  highlightsImg: {
    width: 353,
    height: 253,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
});
