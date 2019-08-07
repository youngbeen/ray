<template>
  <div id="app">
    <div class="title-bar">Ray</div>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { parseString } from 'xml2js'
import md5 from 'crypto-js/md5'
import { getFeeds } from '@/api/system'
import system from '@/models/system'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'app',
  data () {
    return {}
  },

  mounted () {
    // 读取本地存储的RSS订阅源
    system.rssSources = systemCtrl.readRssSubscribes()

    this.getAllFeeds()
  },

  methods: {
    getAllFeeds () {
      system.rssSources.forEach(feed => {
        getFeeds(feed.source).then(data => {
          // console.log(data)
          parseString(data, (err, result) => {
            console.log(err, result)
            // console.log('md5', md5(`${result.rss.channel[0].title[0]}==${result.rss.channel[0].link[0]}`).toString())
            let list = result.rss.channel[0].item || []
            list = list.map(item => {
              let description = item.description[0] || ''
              let plainDescription = ''
              let avatar = ''
              if (description) {
                // 去除style
                plainDescription = description.replace(/<style(.)*\/style>/g, '')
                // 去除html标签
                plainDescription = plainDescription.replace(/<(\/)?[^>]*>/g, '')
                // 去除转义符
                plainDescription = plainDescription.replace(/&nbsp;/g, ' ')

                if (description.indexOf('<img') > -1) {
                  // e.g.  '...<img ... src=... >'
                  let leftStr = description.split('<img')[1]
                  leftStr = leftStr.split('src=')[1]
                  let quoteType = leftStr[0]
                  // console.log(leftStr.split(quoteType)[1])
                  avatar = leftStr.split(quoteType)[1]
                } else if (description.indexOf('<image') > -1) {
                  // e.g.  '...<image ... src=... >'
                  let leftStr = description.split('<image')[1]
                  leftStr = leftStr.split('src=')[1]
                  let quoteType = leftStr[0]
                  // console.log(leftStr.split(quoteType)[1])
                  avatar = leftStr.split(quoteType)[1]
                }
              }
              return {
                id: md5(`${item.title[0]}=!=${item.link[0]}`).toString(),
                title: item.title[0],
                link: item.link[0].replace(/\s|\n|\r/g, ''),
                plainDescription,
                avatar,
                description,
                pubDate: item.pubDate[0] ? (new Date(item.pubDate[0])).getTime() : '',
                author: feed.title,
                icon: feed.icon
              }
            })
            system.chapters.push({
              rssId: feed.id,
              list
            })
            console.log(system.chapters)
          })
        }).catch(err => {
          console.warn(err)
        })
      })
    }
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}
// body {
//   -webkit-app-region: drag;
// }
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
.title-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 22px;
  line-height: 22px;
  background: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  -webkit-app-region: drag;
  z-index: 9999;
}
.container {
  height: calc(100% - 22px);
  padding-top: 22px;
}
</style>
