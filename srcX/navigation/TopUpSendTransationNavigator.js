import { createStackNavigator } from 'react-navigation-stack';
import TopUpSendTransationScreen from '../screens/TransactionScreens/TopUpSendTransationScreen';
import LookerScreen from '../screens/TransactionScreens/LookerScreen';
import TopUpSendSuccess from '../screens/TransactionScreens/TopUpSendSuccess';
import SendToScreen from '../screens/SendToScreen';

const TopUpSendTransationNavigator = createStackNavigator(
  {
    TopUpSendTransationScreen: TopUpSendTransationScreen,
    TopUpSendSuccess: {
      screen: TopUpSendSuccess,
      navigationOptions: {
        headerShown: false
      }
    },
    LookerScreen: {
      screen: LookerScreen,
      navigationOptions: {
        headerShown: false
      }
    },
  }
);

export default TopUpSendTransationNavigator;
