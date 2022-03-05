import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function reset(index, routeName, params) {
  _navigator.dispatch(
    StackActions.reset({
      index: index,
      actions: [
        NavigationActions.navigate({ routeName: routeName, params })
      ],
      key: null
    })
  );
}

function popToTop() {
  _navigator.dispatch(
    StackActions.popToTop()
  );
}

function popToPreviousScreen(n) {
  _navigator.dispatch(
    StackActions.pop(n)
  );
}

function goBack() {
  _navigator._navigation.goBack();
}

export default {
  navigate,
  reset,
  popToTop,
  setTopLevelNavigator,
  goBack,
  popToPreviousScreen
};
