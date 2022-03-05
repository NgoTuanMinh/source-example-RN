import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { sizes } from 'utils/sizings';

interface ButtonProps {
	onPress: () => void,
	icon: any,
    style?: any
}


const IconButton = ({ onPress, style, icon, ...props }: ButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.button} {...props}>
			<Image style={style ? style : styles.icon} source={icon}/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		width: sizes.size_24,
		height: sizes.size_24
	},
});

export default IconButton;
