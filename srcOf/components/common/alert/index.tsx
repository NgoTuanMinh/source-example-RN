import {Alert} from 'react-native';

export function ShowAlert(title: string, content: string, textSuccess = 'OK') {
	setTimeout(() => {
		Alert.alert(title, content, [{text: textSuccess, onPress: () => {}}], {
			cancelable: false,
		});
	}, 100);
}

export const ShowAlertCallBack = (
	alert = '',
	content: string,
	callBack: Function,
	textCancel = 'Cancel',
	textConfirm = 'OK'
) => {
	Alert.alert(
		alert,
		content,
		[
			{
				text: textCancel ,
				style: 'cancel',
			},
			{
				text: textConfirm,
				onPress: () => {
					callBack && callBack();
				},
			},
		],
		{cancelable: false},
	);
};

export const ShowAlertCallBackNotCancel = (
	alert = '',
	content: string,
	callBack: Function,
	textConfirm = 'OK'
) => {
	setTimeout(() => {
		Alert.alert(
			alert,
			content,
			[{
				text: textConfirm,
				onPress: () => {
					callBack && callBack();
				},
			}],
			{cancelable: false},
		);
	}, 100);
};

export function ShowAlertConfirm(
	title = '',
	content = '',
	onConfirm: Function,
	textSuccess = 'OK',
	textCancel = 'Cancel',
) {
	setTimeout(() => {
		Alert.alert(
			title,
			content,
			[{
				text: textCancel,
				onPress: () => {
					onConfirm && onConfirm(false);
				},
				style: 'cancel',
			},
			{
				text: textSuccess,
				onPress: () => {
					onConfirm && onConfirm(true);
				},
				style: 'cancel',
			}], { cancelable: false },
		);
	}, 100);
}
