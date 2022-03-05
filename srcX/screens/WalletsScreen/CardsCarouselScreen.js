import React from "react";
import { View, StyleSheet, ImageBackground, Platform } from "react-native";
import { Text } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import CircleIcons from "../../components/Icons/CircleIcons";
import MemberIcon from "./../../components/Carousel/MemberIcon";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import { translate } from "../../../App";
import { Image } from "react-native";

const CardsCarouselScreen = (props) => {
  const {
    title,
    description,
    mainPriceCurrency,
    mainPrice,
    secondPrice,
    shearedMembers,
    bgImage,
    colors,
    index,
  } = props.item;

  const isHasMembers = () => {
    if (!shearedMembers) return null;
    return (
      <View style={styles.viewImage}>
        {shearedMembers.map((memberImage, index) => {
          return (
            //<MemberIcon key={index} image={memberImage.image} index={index} />
            <Image
              source={{ uri: memberImage.image }}
              style={[styles.avatarStyle, { zIndex: index }]}
            />
          );
        })}
      </View>
    );
  };

  const textInner = () => {
    return (
      <View style={styles.viewTextContentStyle}>
        <Text style={[styles.title, { color: "white" }]}>
          {translate(title)}
        </Text>
        <Text
          style={[styles.walletText, { fontWeight: "normal", opacity: 0.6 }]}
        >
          {description
            ? description
            : "Valid at all events using EventX worldwide"}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {mainPriceCurrency === "X" ? (
            <CircleIcons
              name="logo-regular"
              color="white"
              size={{ width: 28, height: 28 }}
              style={{ marginTop: 2, marginRight: 8 }}
            />
          ) : mainPriceCurrency === "M" ? (
            <Text style={[styles.walletText, styles.txtStyle]}>MYS </Text>
          ) : (
            <Text style={[styles.walletText, styles.txtStyle]}>€ </Text>
          )}
          <Text style={[styles.walletText, styles.txtStyle]}>
            {fixDecimals(mainPrice)}
          </Text>
        </View>

        <View style={styles.viewImageBottom}>
          <Text style={[styles.walletText, { fontSize: 16, opacity: 0.6 }]}>
            €{" "}
            {fixDecimals(
              convertTokensToCurrency(secondPrice, props.conversionRate)
            )}
          </Text>
          {isHasMembers()}
        </View>
      </View>
    );
  };

  const isBgImage = (isImage) => {
    if (isImage) {
      return (
        <View style={styles.walletShadow}>
          <ImageBackground
            source={{ uri: bgImage }}
            style={styles.walletWrapper}
          >
            <LinearGradient
              colors={colors}
              style={[styles.gradient, { opacity: 0.8 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {textInner()}
            </LinearGradient>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View style={styles.walletShadow}>
          <View style={styles.walletWrapper}>
            <LinearGradient
              colors={colors}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {textInner()}
            </LinearGradient>
          </View>
        </View>
      );
    }
  };

  return (
    <View key={index} style={styles.walletContainer}>
      {bgImage && bgImage !== "" ? isBgImage(true) : isBgImage(false)}
      {/* {isBgImage(false)} */}
    </View>
  );
};

export default CardsCarouselScreen;

const styles = StyleSheet.create({
  walletContainer: {
    width: "100%",
    position: "relative",
    height: 156,
    marginVertical: 30,
  },
  walletWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFill,
    opacity: 1,
  },
  walletText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Lato",
  },
  title: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  walletShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 5, height: 30 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  viewImageBottom: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewTextContentStyle: {
    padding: 15,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  txtStyle: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "Lato-Bold",
  },
  viewImage: {
    flexDirection: "row",
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarStyle: {
    width: 25,
    height: 25,
    borderRadius: 16,
    overflow: "hidden",
  },
});
