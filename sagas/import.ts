import { call, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { indexActionCreators } from '../actions';
import { addImportHistory } from '../services/importHistory';

const importFromURLWorker = bindAsyncAction(
  indexActionCreators.importTemplatesFromURL,
  { skipStartedAction: true }
)(function*(url: string) {
  const result = yield call(fetch, url);
  return yield call(result.json.bind(result));
});

export function* watchImportTemplatesFromURL() {
  yield takeEvery(
    indexActionCreators.importTemplatesFromURL.started.type,
    function*(action: Action<string>) {
      try {
        const url = action.payload;
        addImportHistory(url);
        yield call(importFromURLWorker, url);
      } catch (e) {
        /* ignore */
      }
    }
  );
}
