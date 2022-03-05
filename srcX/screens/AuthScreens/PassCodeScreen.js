import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  Platform
} from 'react-native';
import RegistrationStatusBar from '../../components/RegistrationStatusBar';
import { ThemeProvider, Text } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';
import theme from '../../styles/themeStyles';
import { savePasscode } from "../../redux/actions/index.js";
import { translate } from '../../../App';

const PassCodeScreen = ({ navigation, savePasscode, keypair }) => {
  // use state form containing inputed value
  const [passCode, setPassCode] = useState('');
  const [loading, setLoading] = useState(false);
  // Ref on hidden input
  const hiddenInput = useRef(null);
  // check is there passed params, if yes then get confirm
  let confirm = false;
  let prevValue = null;
  if (navigation.state.params) {
    confirm = navigation.state.params.confirm;
    prevValue = navigation.state.params.prevValue;
  }
  // array of elements to map, 4 number for now, they should be different for 'key' property
  let passArray = [0, 1, 2, 3];

  // focus hidden input on tap on screen, and automaticly open keyboard
  const openKeyBoard = () => {
    hiddenInput.current && hiddenInput.current.focus();
  };

  /* 
        every input change we check if there already 4 num we redirect to new screen confirm/finish
        we need to reset field value
    */
  useEffect(() => {
    if (passCode.length >= passArray.length) {
      setPassCode('');

      if (confirm) {
        if (passCode === prevValue) {
          setLoading(true);
          savePasscode(passCode, keypair);
        } else {
          Alert.alert(
            translate("WrongPasscodeInput"),
            'Try again or go back?',
            [
              { text: 'Try again', onPress: () => setPassCode('') },
              {
                text: 'Go back',
                onPress: () => {
                  navigation.navigate('PassCode');
                }
              }
            ],
            { cancelable: false }
          );
        }
      } else {
        navigation.navigate('ConfirmPassCode', {
          confirm: true,
          prevValue: passCode
        });
      }
    }
  }, [passCode]);
  /*
        we use the same component from twe screen
        so we need different values
        in this object we contain all this different values
    */
  const currentScreenInfo = {
    title: confirm ? 'ConfirmPasscode' : 'Passcode',
    description: confirm
      ? 'ConfirmSecretPasscode'
      : 'ChoosePasscode',
    statusBarStep: confirm ? 5 : 4,
    isAutoFocus: confirm ? true : false
  };
  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={theme.droidSafeArea}>
        <NavigationEvents
          onDidFocus={payload => { openKeyBoard() }}
        />
        <TouchableWithoutFeedback onPress={openKeyBoard}>
          <View style={style.wrapper}>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                minWidth: 50,
                opacity: 0
              }}
              keyboardType="numeric"
              ref={hiddenInput}
              value={passCode}
              //autoFocus={true}
              onChangeText={value => setPassCode(value)}
              editable={!loading}
            />
            <RegistrationStatusBar step={currentScreenInfo.statusBarStep} />
            {/* <View style={style.backButton}><HeaderLeftComponent params={{ isGoBack: true }} /></View> */}
            <KeyboardAvoidingView
              style={style.form}
              behavior={"padding"}
              keyboardVerticalOffset="30"
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  paddingTop: 30
                }}
              >
                <Text h1>{translate(currentScreenInfo.title)}</Text>
                <View style={[style.holder, { paddingTop: 50 }]}>
                  {passArray.map(item => {
                    // check is there more characters in field, then set styles for each
                    const itemStyles =
                      item >= passCode.length
                        ? style.tap
                        : [style.tap, style.filled];
                    const itemGradient =
                      item >= passCode.length
                        ? ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.2)']
                        : ['#FF6195', '#C2426C'];
                    return (
                      <View key={item}>
                        <LinearGradient
                          colors={itemGradient}
                          style={itemStyles}
                        />
                      </View>
                    );
                  })}
                </View>
                {loading && <View style={{ marginTop: 50 }}><Text>{translate('PlsWait')}</Text></View>}
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const mapStateToProps = state => {
  return {
    keypair: state.registration.keypair
  }
}

export default connect(mapStateToProps, { savePasscode })(PassCodeScreen);

const style = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  holder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150
  },
  tap: {
    width: 20,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10
  },
  filled: {
    backgroundColor: 'pink'
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    width: '100%',
    paddingTop: 95
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%"
  }
});
