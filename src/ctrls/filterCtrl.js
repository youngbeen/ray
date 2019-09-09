import { dateUtil } from '@youngbeen/angle-util'

export default {
  // 秒数（数字） => 可阅读时间（字符）
  readableTime (val) {
    if (val || val === 0) {
      if (val < 60) {
        // 不足一分钟
        return 'just now'
      } else if (val > 60 * 60 * 24) {
        // 超过1天
        return '> 1 day'
      } else {
        let result = dateUtil.getReadableTimeBySeconds(val)
        if (result.hours) {
          if (result.hours > 1) {
            return `${result.hours} hours ago`
          } else {
            return `${result.hours} hour ago`
          }
        } else {
          if (result.minutes > 1) {
            return `${result.minutes} minutes ago`
          } else {
            return `${result.minutes} minute ago`
          }
        }
      }
    } else {
      return ''
    }
  }
}
