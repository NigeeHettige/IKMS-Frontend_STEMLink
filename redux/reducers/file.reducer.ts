import { COMMON_ACTION_TYPES, FILE_ACTION_TYPES } from '@/utilities/constants/action.constants'


const INITIAL_STATE = {
 
  postFile: {
    isLoading: false,
    data: [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    

    case FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        postFile: {
          ...state.postFile,
          isLoading: true,
        },
      }

    case FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        postFile: {
          ...state.postFile,
          isLoading: false,
          data: action.data,
        },
      }

    case FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        postFile: {
          ...state.postFile,
          isLoading: false,
          data: action.error,
        },
      }

    default:
      return state
  }
}

export default fileReducer
