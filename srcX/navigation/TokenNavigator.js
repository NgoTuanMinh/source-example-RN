import { createStackNavigator } from 'react-navigation-stack';
import TopUpTokenScreen from '../screens/TokenScreens/TopUpTokensScreen';
import TopUpSuccess from '../screens/TokenScreens/TopUpSuccess';
import PaymentScreen from '../screens/Payment/PaymentScreen'
import TermsPaymentScreen from '../screens/Payment/TermsPaymentScreen'
import VerifyPhoneNumberScreen from '../screens/Secutity/VerifyPhoneNumberScreen';
import EnterVerifyCodeScreen from '../screens/Secutity/EnterVerifyCodeScreen';
import VerifySuccessScreen from '../screens/Secutity/VerifySuccessScreen';
import SecurityScreen from '../screens/Secutity/SecurityScreen';
import NotificationScreen from '../screens/NotificationScreen/index';
import WebViewMangoPayScreen from '../screens/WebViewMangoPayScreen/WebViewMangoPayScreen'
const config = {
  initialRouteName: 'TopUpTokens',
};

const TokenNavigator = createStackNavigator(
  {
    TopUpTokens: TopUpTokenScreen,
    Success: {
      screen: TopUpSuccess,
      navigationOptions: {
        headerShown: false
      }
    },
    PaymentScreen: {
      screen: PaymentScreen,
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

    WebViewMangoPayScreen: {
      screen: WebViewMangoPayScreen,
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
TokenNavigator.navigationOptions = {
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

export default TokenNavigator;
