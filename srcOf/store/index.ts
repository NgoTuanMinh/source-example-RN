import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import modules, { rootSaga } from './modules';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(modules.rootReducer, applyMiddleware(sagaMiddleware));

export default store;

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof modules.rootReducer>;
