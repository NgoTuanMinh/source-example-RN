import React from 'react';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Text,
	Image,
	TouchableOpacity,
	SafeAreaView,
	StyleProp,
	TextStyle,
} from 'react-native';
import {
	sizes,
} from 'utils/sizings';
import colors from 'utils/colors';
import icons from 'utils/icons/icons';
import Modal from 'react-native-modal';

interface ModalProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  isCloseButton?: boolean,
  isVisible: boolean;
  children?: any;
  onClose: () => void;
}

const OffyModal = ({
	title,
	titleStyle,
	isCloseButton,
	isVisible,
	children,
	onClose,
}: ModalProps) => {

	return (
		<Modal
			swipeDirection="down"
			onSwipeComplete={onClose}
			animationIn="slideInUp"
			animationOut="slideOutDown"
			style={{margin: 0}}
			isVisible={isVisible}>
			<SafeAreaView style={styles.containerStyle}>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.transparentBackground} />
				</TouchableWithoutFeedback>
				<View style={[styles.modalContainer]}>
					<View style={styles.lineHeaderStyle} />

					{isCloseButton && (
						<View style={styles.headerModalStyle}>
							<TouchableOpacity
								style={styles.closeButton}
								onPress={onClose}>
								<Image source={icons.closeIcon} style={styles.closeIconStyle} />
							</TouchableOpacity>
							<Text style={titleStyle}>{title || ''}</Text>
						</View>
					)}
					
					{children}
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	transparentBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	modalContainer: {
		position: 'absolute',
		width: '100%',
		borderTopRightRadius: sizes.size_12,
		borderTopLeftRadius: sizes.size_12,
		backgroundColor: colors.white,
		alignItems: 'center',
	},
	lineHeaderStyle: {
		width: sizes.size_70,
		height: sizes.size_5,
		backgroundColor: colors.black,
		borderRadius: sizes.size_10,
		marginTop: sizes.size_10,
	},
	headerModalStyle: {
		marginTop: sizes.size_30,
		paddingHorizontal: sizes.size_15,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	closeButton: {
		position: 'absolute',
		left: sizes.size_20,
		top: sizes.size_5,
	},
	closeIconStyle: {
		width: sizes.size_15,
		height: sizes.size_15,
	}
});

export default OffyModal;
