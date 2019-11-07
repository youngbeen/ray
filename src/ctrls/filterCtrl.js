import { dateUtil } from '@youngbeen/angle-util'

export default {
  // 秒数（数字） => 可阅读时间（字符）
  readableTime (val) {
    if (val || val === 0) {
      if (val < 60) {
        // 不足1分钟
        return 'just now'
      } else if (val < 60 * 10) {
        // 不足10分钟
        return 'in 10 minutes'
      } else if (val < 60 * 60) {
        // 不足1小时
        return 'in 1 hour'
      } else if (val > 60 * 60 * 24) {
        // 超过1天
        return '> 1 day'
      } else {
        let result = dateUtil.getReadableTimeBySeconds(val)
        let str = ''
        if (result.hours > 1) {
          str += `${result.hours} hours `
        } else if (result.hours) {
          str += `${result.hours} hour `
        }
        // if (result.minutes > 1) {
        //   str += `${result.minutes} minutes `
        // } else {
        //   str += `${result.minutes} minute `
        // }
        return `${str} ago`
      }
    } else {
      return ''
    }
  }
}
