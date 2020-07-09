import { Context, createWrapper, MakeStore } from 'next-redux-wrapper';
import { applyMiddleware, createStore, Reducer } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer, { initialState, MainState, State } from './reducer';
import rootSaga from './sagas/saga';
import {
  parseSelectedDaysFromString,
  SelectedStrDays,
} from './services/transform';

const sagaMiddleware = createSagaMiddleware();

// FIXME
const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const createStoreWithMiddleware = (r: Reducer<State>, state: State | null) => {
  const store =
    state === null
      ? createStore(r, bindMiddleware([sagaMiddleware]))
      : createStore(r, state, bindMiddleware([sagaMiddleware]));

  (store as any).runSagaTask = () => {
    (store as any).sagaTask = sagaMiddleware.run(rootSaga); // FIXME Add type
  };

  (store as any).runSagaTask(); // FIXME Add type
  return store;
};

const makeStore: MakeStore<State> = (context: Context) => {
  if (context.hasOwnProperty('isServer') && (context as any).isServer) {
    return createStoreWithMiddleware(reducer, initialState);
  } else {
    const {
      persistStore,
      persistReducer,
      createTransform,
    } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const dateTransform = createTransform(
      (inboundState: MainState) => inboundState,
      (outboundState: MainState) => {
        return {
          ...outboundState,
          selectedDays: parseSelectedDaysFromString(
            (outboundState.selectedDays as unknown) as SelectedStrDays
          ),
        };
      },
      { whitelist: ['main'] }
    );

    // 永続化の設定
    const persistConfig = {
      key: 'state', // Storageに保存されるキー名を指定する
      storage, // 保存先としてlocalStorageがここで設定される
      transforms: [dateTransform],
      // whitelist: ['todos'] // Stateは`todos`のみStorageに保存する
      // blacklist: ['visibilityFilter'] // `visibilityFilter`は保存しない
    };
    const persistedReducer = persistReducer(persistConfig, reducer);
    const store = createStoreWithMiddleware(persistedReducer, null);
    (store as any).__persistor = persistStore(store);
    return store;
  }
};

const isEnableDebugMode = (): boolean => {
  return (process.env.enableReduxWrapperDebugMode as any) as boolean;
};

export const wrapper = createWrapper<State>(makeStore, {
  debug: isEnableDebugMode(),
});
