import { axiosPublicInstance} from '.'
import { AnsweringRequestDto } from '@/utilities/models/answering.model'


const answering = (payload: AnsweringRequestDto) => {
  return axiosPublicInstance.post('/qa', payload)
}


export const answeringService = {
  answering
}
