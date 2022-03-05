import { createStackNavigator } from 'react-navigation-stack';
import RefundTokenScreen from '../screens/RefundTokenScreens/RefundTokensScreen'
import RefundSuccess from '../screens/RefundTokenScreens/RefundSuccess';
import RefundPaymentScreen from '../screens/Payment/RefundPaymentScreen'
import TermsPaymentScreen from '../screens/Payment/TermsPaymentScreen'
import VerifyPhoneNumberScreen from '../screens/Secutity/VerifyPhoneNumberScreen';
import EnterVerifyCodeScreen from '../screens/Secutity/EnterVerifyCodeScreen';
import VerifySuccessScreen from '../screens/Secutity/VerifySuccessScreen';
import SecurityScreen from '../screens/Secutity/SecurityScreen';
import NotificationScreen from '../screens/NotificationScreen/index';
const config = {
  initialRouteName: 'RefundTokenScreen',
};

const RefundTokenNavigator = createStackNavigator(
  {
    RefundTokenScreen: RefundTokenScreen,
    RefundSuccess: {
      screen: RefundSuccess,
      navigationOptions: {
        headerShown: false
      }
    },
    RefundPaymentScreen: {
      screen: RefundPaymentScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    TermsPaymentScreen: {
      screen: TermsPaymentScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifyPhoneNumber: {
      screen: VerifyPhoneNumberScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifyCodeToSecurity: {
      screen: EnterVerifyCodeScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifySuccess: {
      screen: VerifySuccessScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    // NotiStack: NotiStack,
  },
  config
);
RefundTokenNavigator.navigationOptions = {
  tabBarLabel: 'Wallets'
}


const SecurityStack = createStackNavigator(
  {
    Security: {
      screen: SecurityScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifyPhoneNumber: {
      screen: VerifyPhoneNumberScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifyCodeToSecurity: {
      screen: EnterVerifyCodeScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
    VerifySuccess: {
      screen: VerifySuccessScreen,
      navigationOptions: {
        headerShown: false,
        cardStyle: {
          backgroundColor: 'rgba(255,255,255,0)'
        }
      }
    },
  },
  {
    defaultRouteName: 'Security',
    headerMode: 'screen'
  }
)
SecurityStack.path = '';

export default RefundTokenNavigator;
