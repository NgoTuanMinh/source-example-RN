import React from 'react';
import { Image, StyleSheet, View, Text, ImageSourcePropType } from 'react-native';
import colors from 'utils/colors';
import icons from 'utils/icons/icons';
import images from 'utils/images';
import { fontWeights, sizes } from 'utils/sizings';

interface IAgentCardProps {
  avatar: string;
  name: string;
  description: string;
  address: string;
  rating: string | number;
  isSuggested?: boolean;
}

interface IIconWithLabelProps {
  label: string;
  icon: ImageSourcePropType;
}

function ProductCard(props: IAgentCardProps) {
	const {
		avatar,
		name,
		description,
		address,
		isSuggested,
	} = props;

	return (
		<View style={isSuggested ? styles.containerInSuggested : styles.container}>
			<Image source={avatar ? { uri: avatar } : images.houseImage} style={isSuggested ? styles.avatarInSuggested : styles.avatar} />
			<View style={styles.content}>
				<View style={styles.infoRow}>
					<IconWithLabel label={'4'} icon={icons.bedIcon} />
					<IconWithLabel label={'3'} icon={icons.bathIcon} />
					<IconWithLabel label={'2'} icon={icons.carIcon} />
					<IconWithLabel label={'500m'} icon={icons.squareIcon} />
				</View>
				<Text style={styles.name}>{name}</Text>

				<Text style={styles.description}>{description}</Text>

				<Text style={styles.price}>{address}</Text>
			</View>
		</View>
	);
}

const IconWithLabel = ({ icon, label }: IIconWithLabelProps) => {
	return (
		<View style={styles.iconLabel}>
			<Image source={icon} style={styles.icon} />

			<Text style={styles.label}>{label}</Text>
		</View>
	);
};

export default ProductCard;

const styles = StyleSheet.create({
	containerInSuggested: {
		...colors.shadowSmall,
		borderRadius: sizes.size_5,
		overflow: 'hidden',
		backgroundColor: colors.white,
		width: sizes.size_325,
	},
	container: {
		backgroundColor: colors.white,
		width: '100%',
	},
	avatarInSuggested: {
		width: '100%',
		height: sizes.size_150,
		resizeMode: 'cover',
	},
	avatar: {
		width: '100%',
		height: sizes.size_210,
		resizeMode: 'cover',
	},
	content: {
		paddingHorizontal: sizes.size_16,
		paddingTop: sizes.size_8,
		paddingBottom: sizes.size_12,
	},
	name: {
		fontWeight: fontWeights.fontWeight_600,
		fontSize: sizes.size_18,
		color: colors.darkGreen,
		marginTop: sizes.size_8,
	},
	description: {
		fontSize: sizes.size_15,
		color: colors.primaryText,
		marginTop: sizes.size_2,
		fontWeight: fontWeights.fontWeight_500,
	},
	price: {
		fontSize: sizes.size_14,
		color: colors.grey,
		marginTop: sizes.size_2,
	},
	icon: {
		width: sizes.size_24,
		height: sizes.size_24,
		resizeMode: 'contain',
		marginRight: sizes.size_8,
	},
	iconLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: sizes.size_16,
	},
	label: {
		fontSize: sizes.size_14,
		color: colors.darkGreen,
	},
	infoRow: {
		flexDirection: 'row',
	}
});
