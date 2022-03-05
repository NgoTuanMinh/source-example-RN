export const formatMoney = (text: string | number) => {
	if (text == 0) {
		return 0;
	}
	let reverseText = String(text).split('').reverse().join('');
	let currentConetent = '';
	for (let i = 1; i <= reverseText.length; i++) {
		if (i % 3 == 0 && i !== reverseText.length) {
			currentConetent = currentConetent + reverseText[i - 1] + ',';
		} else {
			currentConetent = currentConetent + reverseText[i - 1];
		}
	}
	currentConetent = currentConetent.split('').reverse().join('');
	return currentConetent;
};
