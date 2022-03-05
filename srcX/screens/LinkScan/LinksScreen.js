import React, { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import AppHeader from "../../components/HeaderComponent";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  NavigationEvents,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import {
  pairWallet,
  unPairWallet,
  getPairedWearables,
  activeWearables,
  deactiveWearables,
} from "../../redux/actions/index";
import CircleIcons from "../../components/Icons/CircleIcons";
import PairablesListItem from "../../components/PairablesListItem/PairablesListItem";
import { translate } from "../../../App";
import * as ImageSvg from "../../components/Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../../components/Icons/CircleIcons/index";
import Modal from "react-native-modal";
import { Icon } from "react-native-elements";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";
import WalletsScreen from "../WalletsScreen";
import NavigationService from "../../NavigationService";
import LinearGradient from "react-native-linear-gradient";
import { getDataKeystore } from "../../redux/actions/keyStore";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const initDataModal = {
  isShow: false,
  walletKey: "",
  tagId: "",
  active: false,
};

const LinksScreen = (props) => {
  const {
    pairWallet,
    unPairWallet,
    wallets,
    getPairedWearables,
    navigation,
    activeWearables,
    deactiveWearables,
  } = props;
  const [pair, setPair] = useState(false);
  const [isShowModalActive, setIsShowModalActive] = useState(initDataModal);

  const [isLoading, setIsLoading] = useState(false);
  const [walletKey, setWalletKey] = useState(null);

  const onSuccess = useCallback((resp) => {
    enableQrScanner(false);
    const nfcId = resp.data;
    if (nfcId) {
      setIsLoading(true);
      pairWallet(nfcId, toggleLoading);
    }
  }, []);

  const getWalletKey = async () => {
    const walletKey = await getDataKeystore("@walletMainKey");
    setWalletKey(walletKey);
  };

  const enableQrScanner = (flag) => {
    setPair(flag);
  };

  const unPairWearable = (walletKey, tagId, active) => {
    setIsShowModalActive({ isShow: true, walletKey, tagId, active });
  };

  const removeItem = () => {
    onCloseModalActive();
    setIsLoading(true);
    unPairWallet(isShowModalActive.tagId, toggleLoading);
  };

  const activePress = () => {
    onCloseModalActive();
    setIsLoading(true);
    if (isShowModalActive.active)
      deactiveWearables(isShowModalActive.tagId, toggleLoading);
    else activeWearables(isShowModalActive.tagId, toggleLoading);
  };

  const toggleLoading = () => {
    setIsLoading(false);
  };

  const handleClick = () => {
    pair ? onSuccess(false) : navigation.goBack();
  };

  useEffect(() => {
    getWalletKey();
    getPairedWearables();
  }, []);

  const onCloseModalActive = () => {
    setIsShowModalActive(initDataModal);
  };

  const renderItem = () => {
    const isArray = Array.isArray(wallets.pairables);
    if (isArray) {
      return (
        <View>
          <PairablesListItem
            pairedList={wallets.pairables}
            walletKey={walletKey}
            unPairWearable={unPairWearable}
          />
        </View>
      );
    }
    return null;
  };

  const hideQRCode = () => {
    setPair(false);
  };

  const renderLoading = () => {
    if (isLoading)
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="#EA5284" />
        </View>
      );
  };

  const renderModal = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isShowModalActive.isShow}
        onBackdropPress={onCloseModalActive}
        onBackButtonPress={onCloseModalActive}
      >
        <View style={styles.viewBottomView}>
          <TouchableOpacity onPress={activePress} style={styles.buttonStyle}>
            <LinearGradient
              colors={["#B9F215", "#48A44A"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={ImageCustom.icTick} style={styles.iconStyle} />
            </LinearGradient>
            {isShowModalActive.active && (
              <Text style={styles.txtRefreshStyle}>Deactive</Text>
            )}
            {!isShowModalActive.active && (
              <Text style={styles.txtRefreshStyle}>Active</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={removeItem} style={styles.buttonStyle}>
            <LinearGradient
              colors={["#FF5E5E", "#B03636"]}
              style={styles.linearGradientStyle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={ImageCustom.icTrash}
                style={styles.iconTrashStyle}
              />
            </LinearGradient>
            <Text style={styles.txtRefreshStyle}>Remove</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }, [isShowModalActive]);

  const modalQRCode = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0, backgroundColor: "#fff" }}
        isVisible={pair}
        onBackdropPress={hideQRCode}
        onBackButtonPress={hideQRCode}
      >
        <View style={{ flex: 1 }}>
          <SafeAreaView style={styles.containerQRCode}>
            <View
              style={{
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={hideQRCode}
                style={styles.viewIconStyle}
              >
                <Icon name="close" color="black" type="antdesign" />
              </TouchableOpacity>
              <Text style={styles.txtHeaderQRCodeStyle}>
                {translate("ScanQrCode")}
              </Text>
            </View>

            <QRCodeScanner
              cameraStyle={styles.cameraStyleAndroid}
              topViewStyle={styles.zeroContainer}
              bottomViewStyle={styles.zeroContainer}
              reactivate={true}
              showMarker={true}
              onRead={onSuccess}
              flashMode={RNCamera.Constants.FlashMode.auto}
              customMarker={() => {
                return (
                  <ImageSvg.IcQRCode
                    width={width * 0.6}
                    height={height * 0.4}
                  />
                );
              }}
            />
            <View
              style={{
                height: 70,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[styles.textBold, styles.txtBottomQRCode]}>
                {translate("QRCODE_POSITION")}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }, [pair]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        title={translate("Wearables")}
        handleClick={handleClick}
        params={{ isNotification: true }}
      >
        <ScrollView style={styles.container}>
          <View style={{ marginHorizontal: 15 }}>
            {renderItem()}
            <TouchableOpacity
              onPress={() => enableQrScanner(true)}
              style={styles.pairWearableBtn}
            >
              <CircleIcons
                background="#9EC3E5"
                name="plus"
                style={{ width: 44, height: 44 }}
              />
              <Text style={{ marginLeft: 20 }}>
                {translate("PairWearables")}
              </Text>
            </TouchableOpacity>
          </View>

          {pair && modalQRCode}
          {renderModal}
        </ScrollView>
      </AppHeader>
      {renderLoading()}
    </View>
  );
};

LinksScreen.navigationOptions = {
  title: "Wearables",
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    transactions: state.transactions,
  };
};

export default connect(
  mapStateToProps,
  {
    pairWallet,
    unPairWallet,
    getPairedWearables,
    activeWearables,
    deactiveWearables,
  }
)(LinksScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  cameraStyleAndroid: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: isIphoneXorAbove() ? height - 180 : height - 140,
    width: width,
    alignSelf: "center",
    //marginTop: 20
  },
  containerQRCode: {
    flex: 1,
  },
  centerText: {
    padding: 16,
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
    fontSize: 18,
  },
  whiteText: {
    color: "#fff",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  closeScannerBtn: {
    padding: 10,
    backgroundColor: "#EA5284",
  },
  pairWearableBtn: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  tabStyle: {
    flex: 1,
    marginTop: 10,
  },
  viewIconStyle: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  txtBottomQRCode: {
    marginTop: isIphoneXorAbove() ? 46 : 0,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  txtHeaderQRCodeStyle: {
    fontSize: 16,
    alignSelf: "center",
    fontWeight: "bold",
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
});
