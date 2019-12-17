import base from './base'
// import encryptUtil from '@/utils/encryptUtil'
let axios = base.axios
// let baseUrl = base.url

// export const getCaptcha = params => {
//   return axios({
//     method: 'get',
//     url: `${baseUrl}captcha.jpg`,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//     },
//     params
//   }).then(res => res.data)
// }
export const getFeeds = params => {
  return axios({
    method: 'get',
    url: params
    // url: `${baseUrl}portal/upSdkConfig`,
    // data: params
  }).then(res => res.data)
}
// export const getStyleIndex = params => {
//   return axios({
//     method: 'get',
//     url: 'https://raw.githubusercontent.com/youngbeen/rayStylePreset/master/index.json'
//     // data: params
//   }).then(res => res.data)
// }
// export const getStyle = params => {
//   return axios({
//     method: 'get',
//     url: `https://raw.githubusercontent.com/youngbeen/rayStylePreset/master/styles/${params}.json`
//     // data: params
//   }).then(res => res.data)
// }
