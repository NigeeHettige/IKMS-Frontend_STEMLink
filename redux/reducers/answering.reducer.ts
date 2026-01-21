import { COMMON_ACTION_TYPES, ANSWERING_ACTION_TYPES } from '@/utilities/constants/action.constants'


const INITIAL_STATE = {
 
  postAnswer: {
    isLoading: false,
    data: [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const answeringReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    

    case ANSWERING_ACTION_TYPES.POST_ANSWER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        postAnswer: {
          ...state.postAnswer,
          isLoading: true,
        },
      }

    case ANSWERING_ACTION_TYPES.POST_ANSWER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        postAnswer: {
          ...state.postAnswer,
          isLoading: false,
          data: action.data,
        },
      }

    case ANSWERING_ACTION_TYPES.POST_ANSWER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        postAnswer: {
          ...state.postAnswer,
          isLoading: false,
          data: action.error,
        },
      }

    default:
      return state
  }
}

export default answeringReducer
