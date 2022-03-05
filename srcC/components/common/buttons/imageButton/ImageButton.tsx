import React from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import colors from 'utils/colors';
import { fontWeights, sizes } from 'utils/sizings';

interface ButtonProps {
	onPress: () => void,
	primary?: boolean,
    addMore?: boolean,
	image: ImageSourcePropType,
	title: string,
	buttonStyles?: StyleProp<ViewStyle>,
}


const ImageButton = ({ onPress, primary, image, title, buttonStyles, ...props }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, primary ? styles.buttonPrimary : styles.buttonSecondary, buttonStyles]} {...props}>
			<Text style={styles.title}>{title}</Text>
			<Image source={image} style={styles.icon}/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: sizes.size_4,
		paddingHorizontal: sizes.size_16,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	buttonPrimary: {
		backgroundColor: colors.offWhite,
	},
	title: {
		color: colors.darkBlue,
		fontSize: sizes.size_18,
		fontWeight: fontWeights.fontWeight_600
	},
	buttonSecondary: {
		backgroundColor: colors.lightBlue,
	},
	wrapImage: {
		flexDirection: 'row'
	},
	icon: {
		width: sizes.size_48,
		height: sizes.size_48,
		marginVertical: sizes.size_8
	}
});

export default ImageButton;
