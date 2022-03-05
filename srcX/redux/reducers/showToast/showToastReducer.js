import * as types from "../../actions/actionTypes";

const initShowToast = false;

const loadingReducer = (state = initShowToast, action) => {
  switch (action.type) {
    case types.SHOW_TOAST_ACTION: {
      return action.isShow;
    }
    default:
      return state;
  }
};

export default loadingReducer;
