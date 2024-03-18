import axios from 'axios'
import configs from '../configs/api.config'

import { setupInterceptors } from './interceptors'

export const api = setupInterceptors(
  axios.create({
    baseURL: configs.api_url
  })
)