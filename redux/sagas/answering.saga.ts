import { call, put, takeEvery } from "redux-saga/effects";
import { answeringService } from "../../service";

import type { AnsweringRequestDto } from "@/utilities/models/answering.model";


import {
  ANSWERING_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from "@/utilities/constants/action.constants";

function* postAnswer(action: { type: string; payload: AnsweringRequestDto }) {
  try {
    // @ts-expect-error-ignore
    const answer = yield call(answeringService.answering, action.payload);
    yield put({
      type: ANSWERING_ACTION_TYPES.POST_ANSWER + COMMON_ACTION_TYPES.SUCCESS,
      data: answer.data,
    });
  } catch (error) {
    put({
      type: ANSWERING_ACTION_TYPES.POST_ANSWER  + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    });
  }
}

function* answerSaga() {
  yield takeEvery(
    ANSWERING_ACTION_TYPES.POST_ANSWER  + COMMON_ACTION_TYPES.REQUEST,
    postAnswer,
  );
}

export default answerSaga;
