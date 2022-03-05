import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from 'utils/colors';
import icons from 'utils/icons/icons';
import screenName from 'utils/screenName';
import { sizes } from 'utils/sizings';
import { verifyModelIphone } from 'utils/validation';


export default function BottomTabBar({ state, descriptors, navigation }: any) {
	const focusedOptions = descriptors[state.routes[state.index].key].options;
	const isNavigationBar = verifyModelIphone();
	if (focusedOptions.tabBarVisible === false) {
		return null;
	};

	return (
		<View style={styles.containerStyle}>
			{state.routes.map((route: any, index: number) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;
				const getLinkImage = () => {
					if (route.name === screenName.HOME_STACK) {
						return isFocused ? icons.houseFillIcon : icons.houseIcon;
					} else if (route.name === screenName.NOTIFICATION_STACK) {
						return isFocused ? icons.bellFillIcon : icons.bellIcon;
					} else if (route.name === screenName.PROFILE_STACK) {
						return isFocused ? icons.profileFillIcon : icons.profileIcon;
					} else if (route.name === screenName.DASHBOARD_STACK) {
						return isFocused ? icons.dashboardFillIcon : icons.dashboardIcon;
					}
				};

				const onPress = () => {
					navigation.navigate(route.name);
				};

				const onLongPress = () => {
					navigation.emit({
						type: 'tabLongPress',
						target: route.key,
					});
				};

				return (
					<TouchableOpacity
						activeOpacity={1}
						key={index.toString()}
						accessibilityRole="button"
						accessibilityState={{selected: isFocused}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={[styles.tabButton, { paddingBottom: isNavigationBar ? 20 : 0 }]}
					>
						<Image style={styles.tabIcon} source={getLinkImage()} />
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	containerStyle: {
		flexDirection: 'row',
		backgroundColor: Colors.white,
		height: sizes.size_56,
		justifyContent: 'center',
		borderTopWidth: StyleSheet.hairlineWidth,
		borderColor: colors.lightGray,
	},
	tabButton: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems:'center',
		flex: 1,
		height: '100%',
		alignSelf: 'flex-end'
	},
	tabIcon: {
		height: sizes.size_25,
		width: sizes.size_25,
		resizeMode: 'contain',
	},
});