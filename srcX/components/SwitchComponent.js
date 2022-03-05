import React, { useEffect, useState, useCallback } from 'react';
import { Image, Text, View, Platform, TouchableOpacity, StyleSheet, Alert, AppState } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';
import { userLoggedOut } from "../redux/actions/index";
import { storeKey, getDataKeystore } from '../redux/actions/keyStore';
import CircleIcons from '../components/Icons/CircleIcons';
import IcLogout from "../../assets/images/svg/logout.svg";
import { translate } from '../../App';
import NavigationService from '../NavigationService';
import SwitchFaceComponent from './SwitchFaceComponent'
import { toggleFaceId } from '../redux/actions/profile'
// import FingerprintScanner from 'react-native-fingerprint-scanner';

const SwitchComponent = ({ userLoggedOut, toggleFaceId }) => {
  const [isFaceId, setIsFaceId] = useState(false);
  const [showFaceId, setShowFaceId] = useState(false);
  const [lableLogin, setLableLogin] = useState(translate('FaceIdLogin'));
  const dispatch = useDispatch();

  const checkSupport = async () => {
    let lable = "";
    let data = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (data && data.length > 0) {
      let isSupport = await LocalAuthentication.isEnrolledAsync()
      setShowFaceId(isSupport);
      if (Platform.OS === 'ios') {
        if (data.length == 2) {
          lable = translate('FaceIdLogin');
        } else {
          if (data[0] == 1) {
            lable = translate('TouchId');
          } else {
            lable = translate('FaceId');
          }
        }
      } else {
        if (data.length == 2) {
          lable = translate('Biometrics');
        } else {
          if (data[0] == 1) {
            lable = translate('Fingerprint');
          } else {
            lable = translate('FacialAuthentication');
          }
        }
      }
      setLableLogin(lable);
    }
  }

  function handleFaceIdState(value) {
    setIsFaceId(value);
    storeKey("@faceIdEnabled", value);
  }

  const requestIosPermissions = async () => {
    const data = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const indexOfFaceId = data.indexOf(2);
    if (indexOfFaceId != -1) {
      request(PERMISSIONS.IOS.FACE_ID).then(result => {
        if (result === 'granted') {
          handleFaceIdState(true)
        } else {
          Alert.alert(
            "Eventx visitors",
            translate("FACE_ID_PERMISSIONS"),
            [
              {
                text: translate("Enable"), onPress: () => {
                  handleFaceIdState(true);
                  openSettings()
                }
              }
            ],
            { cancelable: false }
          );
        }
      });
    }
  }

  const toggleSwitch = value => {
    toggleFaceId(value);
    setIsFaceId(value);
    storeKey("@faceIdEnabled", value);
    if (Platform.OS === 'ios' && value) {
      requestIosPermissions();
    } else {
      requestAndroidPermissions();
    }
  };

  const requestAndroidPermissions = async () => {
  }

  const handleLogout = () => {
    dispatch(userLoggedOut());
    NavigationService.navigate('AppStack')
  }

  const activateFaceId = async () => {
    const faceIdEnabled = await getDataKeystore("@faceIdEnabled");
    if (faceIdEnabled) {
      setIsFaceId(faceIdEnabled)
    }
  }

  useEffect(() => {
    checkSupport()
    activateFaceId();
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState == 'active') {
        activateFaceId();
      }
    });
    return () => {
      AppState.removeEventListener("change", (nextAppState) => {
        if (nextAppState == 'active') {
          activateFaceId();
        }
      });
    };
  }, []);

  return (
    <View>
      {showFaceId && <View style={styles.settings}>
        <View style={styles.faceId}>
          <CircleIcons name="face-id" iconContainerStyles={styles.icon} color="#EB5757"
          ></CircleIcons>
          <Text numberOfLines={2}
            style={styles.listItemText}>{lableLogin}</Text>
        </View>
        <SwitchFaceComponent faceId={isFaceId} handleSwitch={toggleSwitch} />
      </View>}
      <View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.listItem}
        >
          {/* <Image source={logoutAvatar} resizeMode="cover" style={styles.icon} /> */}
          <IcLogout width={25} height={25} />
          <Text style={[styles.listItemText, { marginLeft: 15 }]}>{translate('Logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    profile: state.profile.uploadResponse
  };
};

export default connect(mapStateToProps, { userLoggedOut, toggleFaceId })(SwitchComponent);

const styles = StyleSheet.create({
  helpContainer: {
    paddingRight: 15,
    paddingLeft: 15
  },
  icon: {
    marginRight: 15,
    maxWidth: 24,
    width: 24,
    height: 24
  },
  settings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  faceId: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15
  },
  listItemText: {
    fontSize: 16,
    paddingRight: '10%'
    //marginLeft: 15
  }
});
