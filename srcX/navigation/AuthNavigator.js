import { createStackNavigator } from 'react-navigation-stack';
import StartScreen from '../screens/AuthScreens/StartScreen';
import LoginPasscodeScreen from "../screens/AuthScreens/LoginPasscodeScreen";
import PhoneNumberScreen from '../screens/AuthScreens/PhoneNumberScreen';
import VerificationCodeScreen from '../screens/AuthScreens/VerificationCodeScreen';
import SetNameScreen from '../screens/AuthScreens/SetNameScreen';
import PassCodeScreen from '../screens/AuthScreens/PassCodeScreen';
import FinishRegistrationScreen from '../screens/AuthScreens/FinishRegistrationScreen';
import SearchCountryCodeScreen from '../screens/AuthScreens/SearchCountryCodeScreen';
import FeaturesScreen from '../screens/AuthScreens/FeaturesScreen';
import RecoverAccountScreen from '../screens/RecoverAccount/RecoverAccountScreen';
import RecoveryPhraseScreen from '../screens/RecoverAccount/RecoveryPhraseScreen';
import VerifyCodeToSetUpPasswordScreen from '../screens/RecoverAccount/VerifyCodeToSetUpPasswordScreen';
import NewPassCodeScreen from '../screens/RecoverAccount/NewPassCodeScreen';
import RecoverSuccessfullyScreen from '../screens/RecoverAccount/RecoverSuccessfullyScreen';
import SetFullNameScreen from '../screens/AuthScreens/SetFullNameScreen';
import SetDateOfBirthScreen from '../screens/AuthScreens/SetDateOfBirthScreen';
import SetNationalityScreen from '../screens/AuthScreens/SetNationalityScreen';
import SetCountryOfResidenceScreen from '../screens/AuthScreens/SetCountryOfResidenceScreen';
import BackupWalletScreen from '../screens/Secutity/BackupWalletScreen';

/*
    to enable custorm transitions
    1) import TransitionConfiguration from './TransitionConfiguration'
    2) add to stackNavigator config property 'transitionConfig: TransitionConfiguration'
*/
const config = {
  initialRouteName: 'Start'
};

const screensConfig = {
  headerShown: false,
  gestureEnabled: false
};

const commonStack = {
  Start: {
    screen: StartScreen,
    navigationOptions: screensConfig
  },
  Phone: {
    screen: PhoneNumberScreen,
    navigationOptions: screensConfig
  },
  Verification: {
    screen: VerificationCodeScreen,
    navigationOptions: screensConfig
  },
  SetName: {
    screen: SetNameScreen,
    navigationOptions: screensConfig
  },
  PassCode: {
    screen: PassCodeScreen,
    navigationOptions: screensConfig
  },
  ConfirmPassCode: {
    screen: PassCodeScreen,
    navigationOptions: screensConfig
  },
  BackupWalletScreen: {
    screen: BackupWalletScreen,
    navigationOptions: {
      headerShown: false,
      cardStyle: {
        backgroundColor: 'rgba(255,255,255,0)'
      }
    }
  },
  FinishRegistration: {
    screen: FinishRegistrationScreen,
    navigationOptions: screensConfig
  },
  SearchCountryCode: {
    screen: SearchCountryCodeScreen,
    navigationOptions: { ...screensConfig, gestureEnabled: true }
  },
  Features: {
    screen: FeaturesScreen,
    navigationOptions: screensConfig
  },
  SetFullName: {
    screen: SetFullNameScreen,
    navigationOptions: screensConfig
  },
  SetDateOfBirth: {
    screen: SetDateOfBirthScreen,
    navigationOptions: screensConfig
  },
  SetNationality: {
    screen: SetNationalityScreen,
    navigationOptions: screensConfig
  },
  SetCountryOfResidence: {
    screen: SetCountryOfResidenceScreen,
    navigationOptions: screensConfig
  }
}

const RegistraionStack = createStackNavigator(commonStack, config);

const AppStack = createStackNavigator(
  {
    Login: {
      screen: LoginPasscodeScreen,
      navigationOptions: screensConfig
    },
    RecoverAccountScreen: {
      screen: RecoverAccountScreen,
      navigationOptions: screensConfig
    },
    VerifyCodeToSetUpPassword: {
      screen: VerifyCodeToSetUpPasswordScreen,
      navigationOptions: screensConfig
    },
    RecoveryPhraseScreen: {
      screen: RecoveryPhraseScreen,
      navigationOptions: screensConfig
    },
    NewPassCode: {
      screen: NewPassCodeScreen,
      navigationOptions: screensConfig
    },
    ConfirmNewPassCode: {
      screen: NewPassCodeScreen,
      navigationOptions: screensConfig
    },
    RecoverSuccessfully: {
      screen: RecoverSuccessfullyScreen,
      navigationOptions: screensConfig
    },
  },
  {
    initialRouteName: 'Login'
  }
);

export { RegistraionStack, AppStack };
