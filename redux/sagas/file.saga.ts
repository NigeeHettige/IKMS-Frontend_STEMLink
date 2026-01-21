import { call, put, takeEvery } from "redux-saga/effects";
import { fileService } from "../../service";

import type { FileDto } from "@/utilities/models/file.model";
import {
  FILE_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from "@/utilities/constants/action.constants";

function* postFile(action: { type: string; payload: FileDto }) {
  try {
    
    // @ts-expect-error-ignore
    const file = yield call(fileService.uploadfile, action.payload);
    yield put({
      type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.SUCCESS,
      data: file.data,
    });
  } catch (error) {
    put({
      type: FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    });
  }
}

function* fileSaga() {
  yield takeEvery(
    FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.REQUEST,
    postFile,
  );
}

export default fileSaga;
