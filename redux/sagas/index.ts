import { all } from 'redux-saga/effects'
import fileSaga from './file.saga'
import answerSaga from './answering.saga'

export default function* rootSaga() {
  yield all([
    fileSaga(),
    answerSaga(),
    
  ])
}
