import React, { useEffect } from "react";
import { View, BackHandler } from "react-native";
import { blockAndroidBackButton } from "../../halpers/android";
import CustomCarousel from "../../components/Carousel/Carousel";

const FeaturesScreen = ({ navigation }) => {
  useEffect(() => {
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        blockAndroidBackButton
      );
    };
  }, []);
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "space-between",
        flex: 1,
      }}
    >
      <CustomCarousel />
    </View>
  );
};

export default FeaturesScreen;
