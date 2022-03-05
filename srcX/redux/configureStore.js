import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers";

export default function configureStore() {
    const enhancer = applyMiddleware(thunk);
    const rootReducer = (state, action) => {
        // when a logout action is dispatched it will reset redux store
        if (action.type === 'USER_LOGGED_OUT') {
          state = undefined;
        }
        return appReducer(state, action);
      };
    const store = createStore(rootReducer, enhancer);
    return store;
}