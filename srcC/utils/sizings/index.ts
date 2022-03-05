import { PixelRatio, Dimensions } from 'react-native';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const realWidth = height > width ? width : height;
const realHeight = width > height ? width : height;

const isTablet = () => {
	let pixelDensity = PixelRatio.get();
	let adjustedWidth = width * pixelDensity;
	let adjustedHeight = height * pixelDensity;
	if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
		return true;
	} else {
		return (
			pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
		);
	}
};

const size = (value: number) => {
	let divider = isTablet() ? 600 : 375;
	return Math.round((value * realWidth) / divider);
};

// const percent = (percent: number) => {
// 	const currentPer = percent / 100;
// 	return currentPer * realHeight;
// };

export function isIphoneXorAbove() {
	const dimen = Dimensions.get('window');
	return (
		Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
	);
}

export const deviceWidth = realWidth;
export const deviceHeight = realHeight;

export const sizes = {
	size_1: size(1),
	size_2: size(2),
	size_3: size(3),
	size_4: size(4),
	size_5: size(5),
	size_6: size(6),
	size_7: size(7),
	size_8: size(8),
	size_9: size(9),
	size_10: size(10),
	size_11: size(11),
	size_12: size(12),
	size_13: size(13),
	size_14: size(14),
	size_15: size(15),
	size_16: size(16),
	size_17: size(17),
	size_18: size(18),
	size_19: size(19),
	size_20: size(20),
	size_21: size(21),
	size_22: size(22),
	size_23: size(23),
	size_24: size(24),
	size_25: size(25),
	size_26: size(26),
	size_27: size(27),
	size_28: size(28),
	size_29: size(29),
	size_30: size(30),
	size_31: size(31),
	size_32: size(32),
	size_33: size(33),
	size_34: size(34),
	size_35: size(35),
	size_36: size(36),
	size_37: size(37),
	size_38: size(38),
	size_39: size(39),
	size_40: size(40),
	size_41: size(41),
	size_42: size(42),
	size_43: size(43),
	size_44: size(44),
	size_45: size(45),
	size_46: size(46),
	size_47: size(47),
	size_48: size(48),
	size_49: size(49),
	size_50: size(50),
	size_51: size(51),
	size_52: size(52),
	size_53: size(53),
	size_54: size(54),
	size_55: size(55),
	size_56: size(56),
	size_57: size(57),
	size_58: size(58),
	size_59: size(59),
	size_60: size(60),
	size_61: size(61),
	size_62: size(62),
	size_63: size(63),
	size_64: size(64),
	size_65: size(65),
	size_66: size(66),
	size_67: size(67),
	size_68: size(68),
	size_69: size(69),
	size_70: size(70),
	size_71: size(71),
	size_72: size(72),
	size_73: size(73),
	size_74: size(74),
	size_75: size(75),
	size_76: size(76),
	size_77: size(77),
	size_78: size(78),
	size_79: size(79),
	size_80: size(80),
	size_90: size(90),
	size_100: size(100),
	size_165: size(165),
	size_150: size(150),
	size_200: size(200),
	size_325: size(325),
	size_375: size(375),
};

type TFontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;

export const fontWeights = {
	fontWeight_100: '100' as TFontWeight,
	fontWeight_200: '200' as TFontWeight,
	fontWeight_300: '300' as TFontWeight,
	fontWeight_400: '400' as TFontWeight,
	fontWeight_500: '500' as TFontWeight,
	fontWeight_600: '600' as TFontWeight,
	fontWeight_700: '700' as TFontWeight,
	fontWeight_800: '800' as TFontWeight,
	fontWeight_900: '900' as TFontWeight
};