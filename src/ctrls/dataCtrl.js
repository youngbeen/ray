import { parseString } from 'xml2js'
import { getFeeds } from '@/api/system'
import system from '@/models/system'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  updateAllFeeds (noLoading = false) {
    system.rssSources.forEach((feed, index) => {
      if (feed.active) {
        if (system.activeRssIndex === -1) {
          // 赋值第一个激活的feed
          system.activeRssIndex = index
        }
        this.updateFeed(feed, noLoading)
      }
    })
  },
  updateFeed (feed, noLoading = false) {
    if (!noLoading) {
      system.loading = true
    }
    getFeeds(feed.source).then(data => {
      // console.log(data)
      if (!noLoading) {
        system.loading = false
      }
      parseString(data, (err, result) => {
        console.log(err, result)
        if (err) {
          window.alert(`Updating failed! Feed(${feed.title}) source has some errors`)
          return
        }
        systemCtrl.removeChapters(feed.id)
        systemCtrl.addChapters(result)
      })
    }).catch(err => {
      console.warn(err)
      if (!noLoading) {
        system.loading = false
      }
      window.alert(`Updating Feed(${feed.title}) failed!`)
    })
  }
}
