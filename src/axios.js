import Vue from 'vue'
import axios from 'axios'
// import qs from 'qs'
import { Message } from 'element-ui'
import { removeStorage, getToken } from '@/util'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.withCredentials = true

// 动态配置接口域名
if (process.env.NODE_ENV === 'production') {
  Vue.prototype.baseURL = 'http://192.168.43.44:8050/'
  axios.defaults.baseURL = ''
} else {
  Vue.prototype.baseURL = ''
  axios.defaults.baseURL = ''
}

axios.interceptors.request.use((config) => {
  config.headers['access-token'] = getToken() // 每个请求都带上token
  config.params = config.params
    ? config.params
    : {}
  return config
  // if (config.method === 'post') { // POST传参序列化
  //   config.data = qs.stringify(config.data)
  // }
  // return config
}, (error) => {
  console.log('参数错误')
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(
  res => {
    // let result = res.data
    // if (result && res.data.code === 1) {
      return Promise.resolve(res)
    // }
  },
  error => {
    const response = error.response
    // console.log(response)
    if (response && Object.prototype.toString.call(response.data) === '[object Object]') {
      Message.error(response.data.detail)
      // token非法 跳到登录页
      if (response.data.code === 1005) {
        removeStorage('username')
        location.href = '/#/login'
        // router.push({ name: 'login' })
      }
    } else {
      console.log(`${error.message}`)
    }
    return Promise.reject(error)
  }
)

export function fetch(url, type, params) {
  if (type === 'get') {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
        .catch((error) => {
          reject(error)
        })
    })
  } else if (type === 'post') {
    return new Promise((resolve, reject) => {
      if (!params) {
        axios.post(url)
          .then(response => {
            resolve(response.data)
          }, err => {
            reject(err)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        axios.post(url, params)
          .then(response => {
            resolve(response.data)
          }, err => {
            reject(err)
          })
          .catch((error) => {
            reject(error)
          })
      }      
    })
  }
}
