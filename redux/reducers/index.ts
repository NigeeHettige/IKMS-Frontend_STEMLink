import { combineReducers } from 'redux'
import fileReducer from './file.reducer'
import answeringReducer from './answering.reducer'


const rootReducer = combineReducers({
    file:fileReducer,
    answer:answeringReducer
})

export default rootReducer