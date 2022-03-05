import * as ActionTypes from "./actionTypes";

export const showToastAction = (isShow) => {
  return {
    type: ActionTypes.SHOW_TOAST_ACTION,
    isShow,
  };
};
