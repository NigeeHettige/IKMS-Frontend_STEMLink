
import { axiosFileUploadInstance} from '.'


const uploadfile = (payload: FormData) => {
  return axiosFileUploadInstance.post('/index-pdf', payload)
}


export const fileService = {
  uploadfile
}
