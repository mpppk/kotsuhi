import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { initialState as iState } from './reducer';
import rootSaga from './sagas/saga';

const sagaMiddleware = createSagaMiddleware();

// FIXME
const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function configureStore(initialState = iState) {
  const store = createStore(
    rootReducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  );

  // @ts-ignore
  store.runSagaTask = () => {
    // FIXME Add type
    // @ts-ignore
    store.sagaTask = sagaMiddleware.run(rootSaga); // FIXME Add type
  };

  // @ts-ignore
  store.runSagaTask(); // FIXME Add type
  return store;
}

export default configureStore;
