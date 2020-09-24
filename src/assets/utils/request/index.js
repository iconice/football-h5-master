import axios from 'axios'
import { Toast } from 'antd-mobile'
import systemConfig from '@/assets/utils/config'
import { getLocalStorage } from '@/assets/utils/storage'
import history from '@/assets/utils/history'
import {
  errorCode,
  errorMsg,
  handleCommonError,
  handleNoCommontError
} from './errorHandle'

const { baseUrl, authKey, basePath } = systemConfig
axios.interceptors.response.use(
  response => {
    Toast.hide()
    if (response.data.code === 100000003) {
      return response.data
    }
    if (response.data.code === 100000007) {
      // 登录过期
      history.replace(`${basePath}/login`)
    }
    handleNoCommontError(response.data.msg)
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(response.data.msg)
  },
  error => {
    Toast.hide()
    const { response } = error
    // 请求有响应
    if (response) {
      const { status, data, config } = response
      data.message = data.message || errorMsg
      const { code, message } = data
      if (status === 400) {
        handleCommonError(data, config)
        // TODO:当状态码为400时
        const errorObj = { code, message }
        if (data && data.code >= 240015 && data.code <= 240021) {
          return Promise.reject(new Error(JSON.stringify(errorObj)))
        }
        if (data && data.code === errorCode.c330024) {
          return Promise.reject(new Error(JSON.stringify(errorObj)))
        }
        return Promise.reject(message)
      }
      // 404 502 ..
      // const msg = errorMsg
      handleNoCommontError(errorMsg)
      return Promise.reject(errorMsg)
      // throw message;
    }
    // 请求超时
    if (error.code === 'ECONNABORTED') {
      // 请求超时
      const timeoutMsg = '请求超时，请稍后再试'
      handleNoCommontError(timeoutMsg)
      return Promise.reject(timeoutMsg)
    }
    const networkErrorMsg = '您的网络出现问题，请检查网络重试'
    handleNoCommontError(networkErrorMsg)
    return Promise.reject(networkErrorMsg)
  }
)

export default async function request(url, options) {
  const hasApi = url.indexOf('api') === -1 // true => no
  const Authorization = getLocalStorage(authKey)
  let headers = {}
  if (options) {
    headers = options.headers || {}
  }
  const defaultOptions = {
    headers: {
      ...headers,
      [authKey]: Authorization
    },
    // credentials: 'include',
    timeout: 20000,
    // withCredentials: true,
    validateStatus(status) {
      return status >= 200 && status < 300 // default
    }
  }
  if (options) {
    // eslint-disable-next-line no-param-reassign
    delete options.headers
  }
  const newOptions = { ...defaultOptions, ...options }
  newOptions.data = newOptions.body
  delete newOptions.body
  if (!newOptions.noLoading) {
    Toast.loading('加载中...', 20000)
  }
  const newUrl = hasApi ? baseUrl + url : url
  return axios(newUrl, newOptions)
}
