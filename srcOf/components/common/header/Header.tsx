import React from 'react';
import {StyleSheet,
	View,
	TouchableOpacity,
	Text,
} from 'react-native';
import { goback } from 'navigation/service';
import colors from 'utils/colors';
import { sizes } from 'utils/sizings';

export default function Header({ title, isBackButton = true }: any) {
	return (
		<View style={styles.headerWithTitleContainer}>
			{isBackButton && <TouchableOpacity onPress={goback} style={styles.backButton}>
				{/* <Image source={ImageCustom.backIcon} style={styles.imgBackIcon} /> */}
			</TouchableOpacity>}
			{title.length > 0 && <Text style={styles.textHeader}>{title}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		marginTop: 30,
		paddingHorizontal: 25,
	},
	imgBackIcon: {
		width: 25,
		height: 25,
		resizeMode: 'contain',
	},
	headerWithTitleContainer: {
		height: sizes.size_60,
		paddingHorizontal: sizes.size_50,
		alignItems: 'center',
		backgroundColor: colors.white,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	backButton: {
		position: 'absolute',
		zIndex: 1,
		left: 0,
		width: sizes.size_50,
		paddingLeft: sizes.size_20,
		paddingVertical: sizes.size_15,
	},
	textHeader: {
		fontSize: sizes.size_17,
		color: colors.black,
	},
});
