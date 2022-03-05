import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen  from './AuthLoadingScreen'
import MainTabNavigator from './MainTabNavigator';
import {AppStack, RegistraionStack} from './AuthNavigator';
import TokenNavigator from './TokenNavigator';
import TopUpSendTransationNavigator from './TopUpSendTransationNavigator';
import RefundTokenNavigator from './RefundTokenNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoadingScreen:AuthLoadingScreen,
      Auth: RegistraionStack,
      AppStack:AppStack,
      Main: MainTabNavigator,
      Token: TokenNavigator,
      RefundToken: RefundTokenNavigator,
      TopUpSendTransationNavigator : {
        screen :TopUpSendTransationNavigator,
        navigationOptions: {
          headerShown: false
        }
      }
    },
    {
      initialRouteName: 'AuthLoadingScreen'
    }
  )
);
