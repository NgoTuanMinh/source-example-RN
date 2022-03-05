import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import colors from 'utils/colors';
import { fontWeights, sizes } from 'utils/sizings';

interface ButtonProps {
	title: string,
	onPress: () => void,
	primary?: boolean,
	outlined?: boolean,
	buttonStyles?: StyleProp<ViewStyle>,
}

const CCButton = ({title, onPress, primary, outlined = false , buttonStyles, ...props }: ButtonProps) => {

	const mainButton = !outlined ? 
		<TouchableOpacity onPress={onPress} style={[styles.button, primary ? styles.buttonPrimary : styles.buttonSecondary, buttonStyles]} {...props}>
			<Text style={styles.titlePrimary}>
				{title}
			</Text>
		</TouchableOpacity>
		:
		<TouchableOpacity onPress={onPress} style={[styles.button, styles.buttonOutlined]} {...props}>
			<Text style={styles.titleSecondary}>
				{title}
			</Text>
		</TouchableOpacity>;

	return (
		<View style={styles.wrapButton}>{mainButton}</View>
	);
};

const styles = StyleSheet.create({
	wrapButton: {
		width: '100%'
	},
	button: {
		borderRadius: sizes.size_4,
		paddingVertical: sizes.size_16,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonPrimary: {
		backgroundColor: colors.pink,
	},
	buttonSecondary: {
		backgroundColor: colors.darkBlue,
	},
	buttonOutlined: {
		borderWidth: 1,
		borderColor: colors.darkBlue
	},
	titlePrimary: {
		color: colors.whiteText,
		fontSize: sizes.size_16,
		fontWeight: fontWeights.fontWeight_600
	},
	titleSecondary: {
		color: colors.darkBlue,
		fontSize: sizes.size_16,
		fontWeight: fontWeights.fontWeight_600
	}
});

export default CCButton;
