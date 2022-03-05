import React from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import colors from 'utils/colors';
import icons from 'utils/icons/icons';
import { sizes } from 'utils/sizings';

interface TSearchInputProps {
	onChangeText: (text:string) => void,
    placeholder?: string
}

const SearchInput = ({onChangeText, placeholder }: TSearchInputProps) => {
	return (
		<View style={styles.wrapInput}>
			<Image source={icons.searchIcon} style={styles.searchIcon} />
			<TextInput onChangeText={onChangeText} style={styles.input} placeholder={placeholder ? placeholder : 'Search Locations'}/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapInput: {
		width: '100%'
	},
	searchIcon: {
		position: 'absolute',
		marginVertical: 16,
		marginLeft: 24,
		width: sizes.size_19,
		height: sizes.size_19
	},
	input: {
		width: '100%',
		borderColor: colors.darkGreen,
		borderWidth: sizes.size_1,
		paddingHorizontal: sizes.size_58,
		fontSize: sizes.size_16,
		borderRadius: sizes.size_4
	}
});

export default SearchInput;
