import { all } from '@redux-saga/core/effects';
import { watchImportTemplatesFromURL } from './import';

export default function* rootSaga() {
  yield all([watchImportTemplatesFromURL()]);
}
