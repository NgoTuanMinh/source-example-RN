import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './stack';

const AppNavigator = () => (
	<SafeAreaProvider>
		<NavigationContainer>
			<RootStack />
		</NavigationContainer>
	</SafeAreaProvider>
);

export default AppNavigator;
