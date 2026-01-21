
import { ANSWERING_ACTION_TYPES, COMMON_ACTION_TYPES } from "../../utilities/constants/action.constants";
import { AnsweringRequestDto } from "@/utilities/models/answering.model";



const postAnswer = (payload:AnsweringRequestDto)=>{
    return{
        type:ANSWERING_ACTION_TYPES.POST_ANSWER + COMMON_ACTION_TYPES.REQUEST,
        payload: payload
    }
}



export const answeringActions  = {
   postAnswer
}