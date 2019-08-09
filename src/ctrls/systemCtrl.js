import md5 from 'crypto-js/md5'
import system from '@/models/system'

export default {
  addRssSubscribes (result, source) {
    let channel = result.rss.channel[0] || {}
    // console.log('md5', md5(`${result.rss.channel[0].title[0]}==${result.rss.channel[0].link[0]}`).toString())
    system.rssSources.push({
      id: md5(`${channel.title[0]}==${channel.link[0]}`).toString(),
      active: true,
      title: channel.title[0],
      source,
      link: channel.link[0],
      description: channel.description[0],
      icon: `${channel.link[0]}/favicon.ico`
    })
  },
  addChapters (result) {
    let channel = result.rss.channel[0] || {}
    let id = md5(`${channel.title[0]}==${channel.link[0]}`).toString()
    let feed = system.rssSources.find(item => item.id === id)
    if (!feed) {
      console.warn('添加的文章未找到对应的feed信息，无法继续操作')
      return
    }
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
  },
  removeChapters (rssId) {
    if (rssId) {
      let index = system.chapters.findIndex(item => item.rssId === rssId)
      if (index > -1) {
        system.chapters.splice(index, 1)
      }
    }
  },
  saveRssSubscribes () {
    window.localStorage.setItem('raySavedRssFeeds', JSON.stringify(system.rssSources))
  },
  readRssSubscribes () {
    let data = window.localStorage.getItem('raySavedRssFeeds') || ''
    if (data) {
      return JSON.parse(data)
    } else {
      return []
    }
    // return [
    //   {
    //     id: '289f2dc20992841b8c111c44bf957041',
    //     active: true,
    //     title: 'Css trick test',
    //     source: 'https://css-tricks.com/feed/',
    //     link: 'https://css-tricks.com/',
    //     description: 'any test',
    //     icon: 'https://css-tricks.com/favicon.ico'
    //   },
    //   {
    //     id: '1212',
    //     active: true,
    //     title: '好奇',
    //     source: 'http://qdaily.com/feed/',
    //     link: 'http://www.qdaily.com/',
    //     description: 'any test',
    //     icon: 'http://www.qdaily.com/favicon.ico'
    //   }
    // ]
  }
}
