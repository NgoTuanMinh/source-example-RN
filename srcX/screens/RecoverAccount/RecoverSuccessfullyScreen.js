import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  BackHandler,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-elements";
import * as Images from "../../components/Icons/CircleIcons";
import { ButtonLinear } from "../Secutity/SecurityScreen";
import { Icon } from "react-native-elements";
import { translate } from "../../../App";
import * as NewRelicRN from "../../../NewRelicRN";

function RecoverSuccessfullyScreen(props) {
  const { navigation } = props;

  useEffect(() => {
    NewRelicRN.nrInit("RecoverSuccessfullyScreen");

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const handleBackButtonClick = () => {
    return true;
  };

  const onCloseScreen = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <Image source={Images.icSuccess} style={styles.icSuccess} />

        <Text style={styles.textNotify}>{`YOU'RE BACK!`}</Text>
        <Text style={styles.txtDetailStyle}>
          Your account is successfully recovered.
        </Text>
      </View>

      <ButtonLinear
        onPress={onCloseScreen}
        label="CONTINUE"
        style={styles.buttonVerify}
        textStyle={styles.textBtnOK}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  txtDetailStyle: {
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 16,
    opacity: 0.4,
    fontWeight: "400",
  },
  buttonVerify: {
    paddingVertical: 15,
    borderRadius: 3,
    alignItems: "center",
    alignSelf: "center",
    width: Dimensions.get("window").width - 30,
    marginBottom: 15,
  },
  icSuccess: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  textNotify: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 30,
    fontSize: 24,
    fontFamily: "Lato",
  },
  textNote: {
    opacity: 0.4,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 15,
  },
  textBtnOK: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  viewIconStyle: {
    position: "absolute",
    top: 20,
    left: 15,
  },
});

export default RecoverSuccessfullyScreen;
