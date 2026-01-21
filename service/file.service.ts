
import { axiosPublicInstance} from '.'


const uploadfile = (payload: FormData) => {
  return axiosPublicInstance.post('/index-pdf', payload)
}


export const fileService = {
  uploadfile
}
