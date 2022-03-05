import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import FeaturesScreen from '../screens/AuthScreens/FeaturesScreen';

const config = Platform.select({
  web: { headerMode: 'none' },
  initialRouteName: 'EventPayments',
  default: {},
});

const screensConfig = {
  headerShown: false,
  gestureEnabled: false
};


const FeatureGuideNavigator = createStackNavigator(
  {
    EventPayments: {
      screen: FeaturesScreen,
      navigationOptions: screensConfig
    },
  },
  config,
);

export default FeatureGuideNavigator;
