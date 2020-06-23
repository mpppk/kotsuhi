import { Context, createWrapper, MakeStore } from 'next-redux-wrapper';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer, { initialState, State } from './reducer';
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

const makeStore: MakeStore<State> = (_context: Context) => {
  const store = createStore(
    reducer,
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

const isEnableDebugMode = (): boolean => {
  return process.env.enableReduxWrapperDebugMode as any as boolean;
}

export const wrapper = createWrapper<State>(makeStore, {debug: isEnableDebugMode()})