export default {
  loading: false,
  readingChapter: {
    icon: '',
    author: '',
    title: ''
  },
  activeRssIndex: -1,
  rssSources: [
    // {
    //   id: '', // 前端生成，首次添加生成，生成规则 = md5(title + '==' + link)
    //   active: true,
    //   title: '',
    //   source: '',
    //   link: '',
    //   description: '',
    //   icon: ''
    // }
  ],
  page: 1, // 保存feeds页面阅读的页数
  bookmarkPage: 1, // 保存书签页面阅读的页数
  chapters: [
    // {
    //   rssId: '',
    //   updateTime: '',
    //   list: [
    //     {
    //       id: '', // 前端生成，生成规则 = md5(title + '=!=' + link)
    //       title: '',
    //       link: '',
    //       pubDate: '',
    //       plainDescription: '', // 前端处理后的纯文本描述，最多100个字符
    //       avatar: '', // 前端处理得到的首个图片
    //       description: '', // html原始预览内容
    //       author: '',
    //       icon: ''
    //     }
    //   ]
    // }
  ],
  bookmarks: [
    // {
    //   id: '', // 前端生成，生成规则 = md5(title + '=!=' + link)
    //   title: '',
    //   link: '',
    //   pubDate: '',
    //   plainDescription: '', // 前端处理后的纯文本描述，最多100个字符
    //   avatar: '', // 前端处理得到的首个图片
    //   description: '', // html原始预览内容
    //   author: '',
    //   icon: '',
    //   rss: {
    //     id: '', // 前端生成，首次添加生成，生成规则 = md5(title + '==' + link)
    //     title: '',
    //     source: '',
    //     link: '',
    //     description: '',
    //     icon: ''
    //   }
    // }
  ]
}
