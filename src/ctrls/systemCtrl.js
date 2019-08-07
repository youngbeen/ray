export default {
  readRssSubscribes () {
    // TODO
    // let data = window.localStorage.getItem('raySavedRssFeeds') || ''
    // if (data) {
    //   return JSON.parse(data)
    // } else {
    //   return []
    // }
    return [
      {
        id: '289f2dc20992841b8c111c44bf957041',
        title: 'Css trick test',
        source: 'https://css-tricks.com/feed/',
        link: 'https://css-tricks.com/',
        description: 'any test',
        icon: 'https://css-tricks.com/favicon.ico'
      },
      {
        id: '1212',
        title: '好奇',
        source: 'http://qdaily.com/feed/',
        link: 'http://www.qdaily.com/',
        description: 'any test',
        icon: 'http://www.qdaily.com/favicon.ico'
      }
    ]
  }
}
