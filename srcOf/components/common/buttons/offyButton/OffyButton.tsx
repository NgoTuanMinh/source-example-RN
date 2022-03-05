import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from 'utils/colors';
import { sizes, fontWeights } from 'utils/sizings';

interface ButtonProps {
	title: string,
	onPress: () => void,
	primary: boolean,
	icon?: any
}

const OffyButton = ({title, onPress, primary, icon , ...props }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, primary ? styles.buttonPrimary : styles.buttonSecondary]} {...props}>
			{icon && <Image style={styles.icon} source={icon}/>}
			<Text style={primary ? styles.titlePrimary : styles.titleSecondary}>
				{title}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: sizes.size_4,
		paddingVertical: sizes.size_16,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	buttonPrimary: {
		backgroundColor: colors.darkGreen,
	},
	titlePrimary: {
		color: colors.white,
		fontSize: sizes.size_16,
		fontWeight: fontWeights.fontWeight_600
	},
	buttonSecondary: {
		backgroundColor: colors.white,
		borderColor: colors.darkGreen,
		borderWidth: 1,
	},
	titleSecondary: {
		color: colors.darkGreen,
		fontSize: sizes.size_16,
		fontWeight: fontWeights.fontWeight_600
	},
	icon: {
		width: sizes.size_18,
		height: sizes.size_18,
		marginRight: sizes.size_11
	}
});

export default OffyButton;
