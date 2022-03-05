import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import colors from 'utils/colors';
import { sizes } from 'utils/sizings';

interface ButtonProps {
	title: string,
	onPress: () => void,
	buttonStyles?: StyleProp<ViewStyle>,
}

const RadiusButton = ({title, onPress, buttonStyles, ...props }: ButtonProps) => {

	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, buttonStyles]} {...props}>
			<Text style={styles.title}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	wrapButton: {
		width: '100%'
	},
	button: {
		backgroundColor: colors.lightBlue,
		borderRadius: sizes.size_16,
		paddingTop: sizes.size_7,
		paddingBottom: sizes.size_7,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%'
	},
	title: {
		color: colors.darkBlue,
		fontSize: sizes.size_14
	},
});

export default RadiusButton;
