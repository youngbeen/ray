import parser from 'fast-xml-parser'
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
      if (parser.validate(data) === true) {
        let result = parser.parse(data, {
          ignoreAttributes: true,
          trimValues: true
        })
        console.log(111, result)
        systemCtrl.removeChapters(feed.id)
        systemCtrl.addChapters(result)
      } else {
        let notify = new Notification('Updating failed!', {
          body: `Feed(${feed.title}) source has some errors`
        })
        notify.onclick = () => {}
      }
    }).catch(err => {
      console.warn(err)
      if (!noLoading) {
        system.loading = false
      }
      let notify = new Notification('Updating failed!', {
        body: `Updating Feed(${feed.title}) failed!`
      })
      notify.onclick = () => {}
    })
  }
}
