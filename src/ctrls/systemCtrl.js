import md5 from 'crypto-js/md5'
import system from '@/models/system'
import config from '@/models/config'

export default {
  addRssSubscribes (result, source) {
    let channel = {}
    if (result.rss && result.rss.channel) {
      channel = result.rss.channel
    } else if (result.feed) {
      channel = result.feed
    }
    // console.log('md5', md5(`${result.rss.channel.title}==${result.rss.channel.link}`).toString())
    system.rssSources.push({
      id: md5(`${channel.title}==${channel.link}`).toString(),
      active: true,
      title: channel.title,
      source,
      link: channel.link,
      description: channel.description && channel.description,
      icon: channel.link && `${channel.link}/favicon.ico`
    })
  },
  addChapters (result) {
    let channel = {}
    if (result.rss && result.rss.channel) {
      channel = result.rss.channel
    } else if (result.feed) {
      channel = result.feed
    }
    let id = md5(`${channel.title}==${channel.link}`).toString()
    let feed = system.rssSources.find(item => item.id === id)
    if (!feed) {
      console.warn('添加的文章未找到对应的feed信息，无法继续操作')
      return
    }
    let list = []
    if (channel.item) {
      list = channel.item
    } else if (channel.entry) {
      list = channel.entry
    }
    list = list.map(item => {
      let description = ''
      if (item.description) {
        description = item.description
      } else if (item.summary) {
        description = item.summary
      }
      let pubDate = ''
      if (item.pubDate) {
        pubDate = item.pubDate
      } else if (item.updated) {
        pubDate = item.updated
      }
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
      // console.log(item.link)
      return {
        id: md5(`${item.title}=!=${item.link}`).toString(),
        title: item.title,
        link: item.link,
        plainDescription,
        avatar,
        description,
        pubDate: pubDate ? (new Date(pubDate)).getTime() : '',
        author: feed.title,
        icon: feed.icon
      }
    })
    // NOTE 针对某些比较“流氓”的feed，始终返回当前时间作为pubDate的，统一重置为空，避免“霸占”最新列表
    if (list.length > 2 && list[0].pubDate === list[1].pubDate && list[0].pubDate === list[2].pubDate) {
      list = list.map(item => {
        item.pubDate = ''
        return item
      })
    }
    system.chapters.push({
      rssId: feed.id,
      updateTime: new Date(),
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
  },
  addBookmark (chapter) {
    if (!chapter || system.bookmarks.some(item => item.id === chapter.id)) {
      return
    }
    system.bookmarks.unshift(chapter)
  },
  removeBookmark (chapter) {
    if (!chapter || !chapter.id) {
      return
    }
    let targetIndex = system.bookmarks.findIndex(item => item.id === chapter.id)
    if (targetIndex > -1) {
      system.bookmarks.splice(targetIndex, 1)
    }
  },
  saveBookmarks () {
    window.localStorage.setItem('raySavedBookmarks', JSON.stringify(system.bookmarks))
  },
  readBookmarks () {
    let data = window.localStorage.getItem('raySavedBookmarks') || ''
    if (data) {
      return JSON.parse(data)
    } else {
      return []
    }
  },
  saveConfig () {
    window.localStorage.setItem('raySavedConfig', JSON.stringify(config))
  },
  readConfig () {
    let data = window.localStorage.getItem('raySavedConfig') || ''
    if (data) {
      return JSON.parse(data)
    } else {
      return {}
    }
  }
}
