import React, { Fragment } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import colors from 'utils/colors';
import images from 'utils/images';
import { fontWeights, sizes } from 'utils/sizings';

interface IGreenCardProps {
  square?: boolean;
	children: React.ReactNode,
}

function GreenCard(props: IGreenCardProps) {
	const {
		square,
		children,
	} = props;

	return (
		<ImageBackground source={images.greenCard} imageStyle={styles.imageBg} style={square ? styles.squareContainer : styles.container}>
			{square
				? <Fragment>{children}</Fragment>
				: <View style={styles.contentCard}>{children}</View>}
		</ImageBackground>
	);
}

export default GreenCard;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		minHeight: sizes.size_190,
	},
	squareContainer: {
		width: sizes.size_160,
		height: sizes.size_160,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageBg: {
		width: '100%',
		height: '100%',
		borderRadius: sizes.size_24,
		resizeMode: 'cover',
		padding: 24,
	},
	contentCard: {
		padding: 24,
		justifyContent: 'space-between',
		flex: 1
	},
	label: {
		color: colors.white,
		fontSize: sizes.size_14,
	},
	value: {
		color: colors.white,
		fontSize: sizes.size_32,
		fontWeight: fontWeights.fontWeight_600
	}
});
