import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-elements";
import * as Images from "../../components/Icons/CircleIcons";
import { ButtonLinear } from "./SecurityScreen";
import NavigationService from "../../NavigationService";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";

const widthScreen = Dimensions.get("window").width;

function VerifySuccessScreen(props) {
  const { wallets, navigation } = props;

  const phoneNumber = navigation?.state?.params?.phoneNumber || false;
  const isPayment = navigation?.state?.params?.isPayment || false;
  const email = navigation?.state?.params?.email || false;
  const selectedData = navigation.state.params.selectedData;
  const textModethod = phoneNumber
    ? "PHONE NUMBER IS \nVERIFIED"
    : "EMAIL IS VERIFIED";
  const textPhoneNote = `Now you can use this phone number to recover your account.`;
  const textEmailNote = `Now you can use this email to recover your\naccount`;

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const onBack = () => {
    if (isPayment) {
      NavigationService.navigate("PaymentScreen", {
        selectedData: selectedData,
      });
      return;
    }
    NavigationService.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        {/* <TouchableOpacity onPress={onBack} style={styles.viewIconStyle}>
          <Icon name="close" color="black" type="antdesign" />
        </TouchableOpacity> */}

        <Image source={Images.icSuccess} style={styles.icSuccess} />
        <Text style={styles.textNotify}>{`YOUR ${textModethod}`}</Text>
        <Text style={styles.textNote}>
          {phoneNumber ? textPhoneNote : textEmailNote}
        </Text>
      </View>

      <ButtonLinear
        onPress={onBack}
        label="CONTINUE"
        style={styles.buttonVerify}
        textStyle={{ color: "white", fontWeight: "bold", fontSize: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonVerify: {
    // paddingVertical: 10,
    borderRadius: 3,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: widthScreen - 30,
    marginBottom: 30,
    // height: 56,
    paddingVertical: 15,
  },
  icSuccess: {
    width: 74,
    height: 74,
    resizeMode: "contain",
  },
  textNotify: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 24,
  },
  textNote: {
    // opacity: 0.4,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 15,
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.4)",
  },
  viewIconStyle: {
    position: "absolute",
    top: 20,
    left: 0,
    height: 45,
    width: 45,
  },
});

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

export default connect(mapStateToProps)(VerifySuccessScreen);
