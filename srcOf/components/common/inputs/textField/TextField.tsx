import React, { useState } from 'react';
import { Image, StyleProp, StyleSheet, TextStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultTheme, TextInput } from 'react-native-paper';
import colors from 'utils/colors';
import icons from 'utils/icons/icons';
import { sizes } from 'utils/sizings';

interface TTextFieldProps {
	label: string,
	onChangeText: (text:string) => void,
	type?: string
	style?: StyleProp<TextStyle>
	placeholder?: string
}

const theme = {
	...DefaultTheme,
	colors: {
	  ...DefaultTheme.colors,
	  primary: colors.darkGreen,
	},
};

interface TEyeIconProps {
	onPress: () => void
}

const EyeIcon = ({onPress}: TEyeIconProps) => {
	return <TouchableOpacity onPress={onPress}>
		<Image source={icons.eyeIcon} style={styles.iconRight} />
	</TouchableOpacity>;
};

const TextField = ({label, onChangeText, style, type, placeholder, ...props}: TTextFieldProps) => {
	const isPasswordInput = type === 'password';
	const [hidePassword, setHidePassword] = useState(isPasswordInput);

	const onPressEyeIcon = () => {
		setHidePassword(!hidePassword);
	};

	return (
		<TextInput
			mode="outlined"
			label={label}
			placeholder={placeholder ? placeholder : ''}
			right={isPasswordInput ? <TextInput.Icon name={() => <EyeIcon onPress={onPressEyeIcon}/>}/> : null}
			outlineColor={colors.lightGray}
			secureTextEntry={hidePassword}
			style={style ? style : styles.textField}
			theme={theme}
			onChangeText={onChangeText}
			{...props}
		/>
	);
};

const styles = StyleSheet.create({
	textField: {
		width: '100%',
		borderRadius: sizes.size_4
	},
	iconRight: {
		width: sizes.size_22,
		height: sizes.size_19,
		marginRight: sizes.size_13
	}
});

export default TextField;
