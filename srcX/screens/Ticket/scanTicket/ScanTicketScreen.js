import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator, NavigationEvents } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { translate } from '../../../../App';
import * as ImageSvg from '../../../components/Icons/CircleIcons/ImageSvg'
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import { isIphoneXorAbove } from '../../../utils/CheckTypeToken'
import NavigationService from '../../../NavigationService';
import ErrorCode from '../../../constants/ErrorCode';
import { checkedInTicket } from '../../../redux/actions';
import { setShowScanTicket } from '../../../redux/actions/event';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ScanTicketScreen = (props) => {
  const {navigation, showScanTicket, setShowScanTicket } = props;
  const [isLoading, setIsLoading] = useState(false);
  const onSuccess = useCallback(resp => {
    setShowScanTicket(false);
    const nfcId = resp.data;
    if (nfcId) {
      setIsLoading(true);
      checkedInTicket(nfcId, onCheckInCallback);
    }
  }, []);

  const onCheckInCallback = (response) => {
    setIsLoading(false);
    setShowScanTicket(false);
    NavigationService.navigate("TicketResultScanQrcodeScreen", { success:  response.success, ErrorCode: response.data.ErrorCode, ticketId: response.data._id});
  }

  const hideQRCode = () => {
    navigation.goBack();
  }

  const renderLoading = () => {
    if (isLoading)
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="#EA5284" />
        </View>
      );
  }

  const modalQRCode = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0, backgroundColor: '#fff' }}
        isVisible={showScanTicket}
        onBackdropPress={hideQRCode}
        onBackButtonPress={hideQRCode}
      >
        <View style={{ flex: 1, }}>
          <SafeAreaView style={styles.containerQRCode}>
            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={hideQRCode}
                style={styles.viewIconStyle}>
                <Icon name="close" color='black' type="antdesign" />
              </TouchableOpacity>
              <Text style={styles.txtHeaderQRCodeStyle}>{translate("ScanTicket")}</Text>
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
                  <ImageSvg.IcQRCode width={width * 0.6} height={height * 0.4} />
                )
              }}
            />
            <View style={{ height: 70, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={[styles.textBold, styles.txtBottomQRCode]}>{translate("QRCODE_POSITION")}</Text>
            </View>

          </SafeAreaView>
        </View>

      </Modal>
    )
  }, [showScanTicket]);

  return (
    <View style={styles.container}>
      {showScanTicket && modalQRCode}
      {renderLoading()}
    </View>
  );
}

ScanTicketScreen.navigationOptions = {
  title: 'ScanTicket',
  headerShown: false,
};

const mapStateToProps = state => {
  return ({
    showScanTicket: state.events.showScanTicket
  })
};

export default connect(mapStateToProps, { setShowScanTicket })(ScanTicketScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  cameraStyleAndroid: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: isIphoneXorAbove() ? height - 180 : (height - 140),
    width: width,
    alignSelf: 'center',
    //marginTop: 20
  },
  containerQRCode: {
    flex: 1,
  },
  centerText: {
    padding: 16
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
    fontSize: 18,
  },
  whiteText: {
    color: '#fff'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  closeScannerBtn: {
    padding: 10,
    backgroundColor: '#EA5284'
  },
  pairWearableBtn: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabStyle: {
    flex: 1,
    marginTop: 10,
  },
  viewIconStyle: {
    position: 'absolute',
    top: 15,
    left: 15
  },
  txtBottomQRCode: {
    marginTop: isIphoneXorAbove() ? 46 : 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  txtHeaderQRCodeStyle: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  viewLoadingStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  linearGradientStyle: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10
  },
  iconStyle: {
    width: 14,
    height: 10,
    resizeMode: 'contain'
  },
  iconTrashStyle: {
    width: 18,
    height: 20,
    resizeMode: 'contain'
  },
  txtRefreshStyle: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Lato',
  }
});
