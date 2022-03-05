import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from 'utils/colors';
import { sizes, fontWeights } from 'utils/sizings';
import icons from 'utils/icons/icons';

interface ButtonProps {
	onPress: () => void,
	primary?: boolean,
    addMore?: boolean
}


const ImageButton = ({ onPress, primary, addMore = false, ...props }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={[styles.button, primary && !addMore ? styles.buttonPrimary : styles.buttonSecondary]} {...props}>
			<View>
				{addMore 
					? <View style={styles.btnContainer}>
						<Image style={styles.addMoreIcon} source={icons.addMoreIcon}/>
						<Text style={styles.titleSecondary}>Add More</Text>
					</View>
					:
					<Image style={styles.icon} source={primary ? icons.imageIconWhite : icons.imageIconGreen}/>
				}
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: sizes.size_4,
		paddingVertical: sizes.size_16,
		width: sizes.size_165,
		height: sizes.size_90,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonPrimary: {
		backgroundColor: colors.darkGreen,
	},
	titleSecondary: {
		color: colors.darkGreen,
		fontSize: sizes.size_16,
		fontWeight: fontWeights.fontWeight_600
	},
	buttonSecondary: {
		backgroundColor: colors.lightBlue,
	},
	icon: {
		width: sizes.size_40,
		height: sizes.size_36
	},
	addMoreIcon: {
		width: sizes.size_24,
		height: sizes.size_24,
		marginBottom: 8
	},
	btnContainer: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 20
	}
});

export default ImageButton;
