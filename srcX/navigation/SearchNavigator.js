// import { createStackNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import TransitionConfiguration from './TransitionConfiguration'

import SearchCountryCodeScreen from '../screens/AuthScreens/SearchCountryCodeScreen';
import SearchOperationScreen from '../screens/WalletsScreen/SearchOperationScreen'


/*
    to enable custorm transitions
    1) import TransitionConfiguration from './TransitionConfiguration'
    2) add to stackNavigator config property 'transitionConfig: TransitionConfiguration'
*/
const config = {
    transitionConfig: TransitionConfiguration
};

const screensConfig = {
    headerShown: false,
    gestureEnabled: false
};


const RegistraionStack = createStackNavigator(
    {
        SearchCountryCode: {
            screen: SearchCountryCodeScreen,
            navigationOptions: screensConfig
        },
        SearchOperation: {
            screen: SearchOperationScreen,
            navigationOptions: screensConfig
        },
    },
    config,
);

export default RegistraionStack;
