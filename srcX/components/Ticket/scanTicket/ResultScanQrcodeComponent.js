import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  SafeAreaView,
} from "react-native";
import { translate } from "../../../../App";
import * as Images from "../../Icons/CircleIcons";
import LinearGradient from "react-native-linear-gradient";
import { Button } from "react-native-elements";

export default (ResultScanQrcodeComponent = (props) => {
  const { isSuccess, onBackPress, ticketId, reason } = props;

  const renderSuccess = () => {
    return (
      <View style={styles.viewContentStyle}>
        <Image source={Images.icSuccess} style={styles.icSuccess} />
        <Text style={styles.txtDetailStyle}>Ticket ID</Text>
        <Text style={styles.textNotify}>{ticketId}</Text>

        <Text style={styles.txtDetailStyle}>
          {translate("IsSuccessCheckedin")}
        </Text>
      </View>
    );
  };

  const renderFail = () => {
    return (
      <View style={styles.viewContentStyle}>
        <Image source={Images.qrCodeFail} style={{ width: 80, height: 80 }} />

        <Text style={styles.textNotify}>{reason}</Text>

        <Text style={styles.txtDetailStyle}>{translate("scan_failed")}</Text>
      </View>
    );
  };
  return (
    <View style={styles.containerStyle}>
      <SafeAreaView style={styles.viewContentStyle}>
        {isSuccess && renderSuccess()}
        {!isSuccess && renderFail()}
        <View style={styles.viewBottomStyle}>
          <Button
            buttonStyle={{
              paddingVertical: 15,
              borderRadius: 4,
              marginBottom: 30,
            }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#FF6195", "#C2426C"],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
            title={
              isSuccess
                ? translate("SCAN_NEXT_TICKET").toUpperCase()
                : translate("TRY_AGAIN").toUpperCase()
            }
            titleStyle={{ color: "white", fontWeight: "700", fontSize: 20 }}
            onPress={onBackPress}
          />
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  viewContentStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  txtDetailStyle: {
    textAlign: "center",
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 14,
    opacity: 0.4,
  },
  viewBottomStyle: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
