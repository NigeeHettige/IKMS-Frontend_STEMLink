import { FileDto } from "@/utilities/models/file.model";
import { FILE_ACTION_TYPES, COMMON_ACTION_TYPES } from "../../utilities/constants/action.constants";



const postFile = (payload:FileDto)=>{
    return{
        type:FILE_ACTION_TYPES.POST_FILE + COMMON_ACTION_TYPES.REQUEST,
        payload: payload
    }
}



export const fileActions  = {
   postFile
}