import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
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
}

function AgentCard(props: IAgentCardProps) {
	const {
		avatar,
		name,
		description,
		address,
		rating,
	} = props;

	return (
		<View style={styles.container}>
			<Image source={avatar ? { uri: avatar } : images.defaultAgent} style={styles.avatar} />

			<View style={styles.content}>
				<Text style={styles.name}>{name}</Text>

				<Text style={styles.description}>{description}</Text>

				<Text style={styles.address}>{address}</Text>

				{Number(rating) > 0 && <Rating rating={Number(rating)} />}
			</View>
		</View>
	);
}

const Rating = ({ rating }: { rating: number }) => {
	const renderRating = () => {
		const result = [];

		for(let i = 0 ; i < rating ; i++) {
			result.push(
				<Image source={icons.starFillIcon} style={styles.starIcon} />
			);
		}

		return result;
	};

	return (
		<View style={styles.ratingView}>
			{renderRating()}
		</View>
	);
};

export default AgentCard;

const styles = StyleSheet.create({
	container: {
		...colors.shadowSmall,
		borderRadius: sizes.size_5,
		width: sizes.size_200,
		overflow: 'hidden',
		backgroundColor: colors.white,
	},
	avatar: {
		width: sizes.size_200,
		height: sizes.size_200,
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
		color: colors.primaryText,
	},
	description: {
		fontSize: sizes.size_14,
		lineHeight: sizes.size_19,
		color: colors.primaryText,
		marginTop: sizes.size_4,
	},
	address: {
		fontSize: sizes.size_16,
		color: colors.grey,
		marginTop: sizes.size_2,
	},
	ratingView: {
		flexDirection: 'row',
		marginTop: sizes.size_6,
	},
	starIcon: {
		width: sizes.size_19,
		height: sizes.size_19,
		resizeMode: 'contain',
		marginRight: sizes.size_5,
	}
});
