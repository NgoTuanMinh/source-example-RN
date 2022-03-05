import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from 'screens';
// import { Header } from 'components';
import ScreenName from 'utils/screenName';
import colors from 'utils/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabBar from 'components/common/bottomTabBar/BottomTabBar';

const Stack = createStackNavigator();
const Home = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export const RootStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name={ScreenName.BOTTOM_STACK} component={BottomStack} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
};

const HomeStack = () => {
	return (
		<Home.Navigator screenOptions={{cardStyle: { backgroundColor: colors.white }}}>
			<Home.Screen name={ScreenName.HOME_SCREEN} component={HomeScreen} options={{ headerShown: false }} />
			{/* <Home.Screen name={ScreenName.HOME_SCREEN} component={HomeScreen} options={{header: ({ navigation }) => <Header title="Home" isBackButton={false} navigation={navigation} />}} /> */}
		</Home.Navigator>
	);
};

const BottomStack = () => {
	return (
		<BottomTab.Navigator
			tabBar={props => <BottomTabBar {...props} />}
		>
			<BottomTab.Screen name={ScreenName.HOME_STACK} component={HomeStack} options={{ headerShown: false }} />
			<BottomTab.Screen name={ScreenName.PROFILE_STACK} component={HomeStack} options={{ headerShown: false }} />
			<BottomTab.Screen name={ScreenName.EXPLORE_STACK} component={HomeStack} options={{ headerShown: false }} />
		</BottomTab.Navigator>
	);
};
