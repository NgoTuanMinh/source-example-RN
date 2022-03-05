import * as React from 'react';

export const navigationRef = React.createRef();

export function goback() {
	navigationRef.current?.goBack();
}

export function navigate(name, params) {
	navigationRef.current?.navigate(name, params);
}

export function navigateAndSetToTop(screenName) {
	/*Clear and set screenName on top of stack*/
	navigationRef.current?.reset({
		index: 0,
		routes: [{name: screenName}],
	});
}
