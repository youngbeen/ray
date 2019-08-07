import axios from 'axios'
// 全局参数，自定义参数可在发送请求时设置
axios.defaults.timeout = 30000 // 超时时间ms
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// const testServerDomain = 'http://172.30.251.41:7108' // 请求域 测试环境

// 请求时的拦截
// 回调里面不能获取错误信息
axios.interceptors.request.use(
  function (config) {
    // 发送请求之前做一些处理
    return config
  },
  function (error) {
    // 当请求异常时做一些处理
    console.warn('请求异常：' + JSON.stringify(error))
    return Promise.reject(error)
    // return Promise.reject('请求异常，请稍后再试');
  }
)

axios.interceptors.response.use(function (response) {
  // Do something with response data
  // console.log('响应：' + JSON.stringify(response))
  return response
}, function (error) {
  // Do something with response error
  console.warn('响应出错：', error)
  return Promise.reject(error)
})

const base = {
  url: process.env.NODE_ENV === 'development' ? '' : '',
  axios
}
export default base
