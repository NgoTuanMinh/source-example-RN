import React, { useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { translate } from "../../../App";
import * as Images from "../Icons/CircleIcons";
import LinearGradient from "react-native-linear-gradient";
import { Button } from "react-native-elements";
import * as ImageCustom from "../../components/Icons/CircleIcons/index";

export default (ResultScanQrcodeComponent = (props) => {
  const {
    isSuccess,
    reason,
    navigation,
    onBackPress,
    onCloseActiveConfirmModal,
    showConfirmActive,
    onActivePress,
    isLoading,
  } = props;

  const renderSuccess = () => {
    return (
      <View style={styles.viewContentStyle}>
        <Image source={Images.icSuccess} style={styles.icSuccess} />

        <Text style={styles.textNotify}>
          {translate("DEVICE_SUCCESSFULLY_PAIRED")}
        </Text>

        <Text style={styles.txtDetailStyle}>{reason}</Text>
      </View>
    );
  };

  const renderFail = () => {
    return (
      <View style={styles.viewContentStyle}>
        <Image source={Images.qrCodeFail} style={styles.icSuccess} />

        <Text style={styles.textNotify}>
          {translate("DEVICE_PAIRING_FAILED")}
        </Text>

        <Text style={styles.txtDetailStyle}>{reason}</Text>
      </View>
    );
  };

  const renderConfirmActive = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={showConfirmActive}
        onBackdropPress={onCloseActiveConfirmModal}
        onBackButtonPress={onCloseActiveConfirmModal}
      >
        <View style={styles.viewBottomView}>
          <TouchableOpacity onPress={onActivePress} style={styles.buttonStyle}>
            <LinearGradient
              colors={["#B9F215", "#48A44A"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={ImageCustom.icTick} style={styles.iconStyle} />
            </LinearGradient>
            <Text style={styles.txtRefreshStyle}>Active</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCloseActiveConfirmModal}
            style={styles.buttonStyle}
          >
            <LinearGradient
              colors={["#FF5E5E", "#B03636"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={ImageCustom.icx}
                style={{ width: 15, height: 15, resizeMode: "contain" }}
              />
            </LinearGradient>
            <Text style={styles.txtRefreshStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }, [showConfirmActive]);

  const renderLoading = useMemo(() => {
    if (!isLoading) return;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  return (
    <View style={styles.containerStyle}>
      <SafeAreaView style={styles.viewContentStyle}>
        {isSuccess && renderSuccess()}
        {!isSuccess && renderFail()}
        <View style={styles.viewBottomStyle}>
          <Button
            buttonStyle={{ paddingVertical: 15, borderRadius: 4 }}
            ViewComponent={LinearGradient}
            linearGradientProps={{
              colors: ["#FF6195", "#C2426C"],
              start: { x: 0, y: 0.5 },
              end: { x: 1, y: 0.5 },
            }}
            title={translate("Continue").toUpperCase()}
            titleStyle={{ color: "white", fontSize: 20, fontWeight: "700" }}
            onPress={onBackPress}
          />
        </View>
        {renderConfirmActive}
      </SafeAreaView>
      {renderLoading}
    </View>
  );
});

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  viewCloseStyle: {
    position: "absolute",
    top: 10,
    left: 10,
    ...(Platform.OS !== "android" && {
      top: 30,
    }),
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
    marginBottom: 20,
  },
  viewBottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  linearGradientStyle: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  iconStyle: {
    width: 18,
    height: 14,
    resizeMode: "contain",
  },
  iconTrashStyle: {
    width: 18,
    height: 20,
    resizeMode: "contain",
  },
  txtRefreshStyle: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Lato",
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
