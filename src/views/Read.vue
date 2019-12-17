<template>
  <div class="page-view">
    <div class="window">
      <!-- <iframe v-if="url" :src="url" frameborder="0"></iframe> -->
      <div class="chapter" v-html="content"></div>
      <div class="chapter-end">- The end -</div>
      <div class="bottom-btns">
        <div class="btn" @click="back()">
          &lt; back
        </div>
      </div>
    </div>

    <div class="box-btns">
      <div class="btn" @click="back()">
        <img class="h-img" src="../assets/arrow_left.png" alt="<">
        <span class="text">back</span>
      </div>
      <div class="btn" v-if="chapter.link" @click="view()">
        <img class="h-img" src="../assets/view.png" alt="">
      </div>
      <div class="btn" v-if="chapter.link" @click="share()">
        <img class="n-img" src="../assets/link.png" alt="">
      </div>
      <div class="btn" v-show="!hasBookmarked" @click="bookmark()">
        <img class="n-img" src="../assets/star.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { shell, clipboard } from 'electron'
// import { getStyleIndex, getStyle } from '@/api/system'
import system from '@/models/system'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'pageView',
  data () {
    return {
      backLock: false,
      chapter: {
        id: '', // 前端生成，生成规则 = md5(title + '=!=' + link)
        title: '',
        link: '',
        pubDate: '',
        plainDescription: '', // 前端处理后的纯文本描述，最多100个字符
        avatar: '', // 前端处理得到的首个图片
        description: '', // html原始预览内容
        author: '',
        icon: '',
        rss: {
          id: '', // 前端生成，首次添加生成，生成规则 = md5(title + '==' + link)
          title: '',
          source: '',
          link: '',
          description: '',
          icon: ''
        }
      },
      content: '', // 处理后的正文
      system
    }
  },
  computed: {
    hasBookmarked () {
      return this.system.bookmarks.some(item => item.id === this.chapter.id)
    }
  },

  mounted () {
    let chapter = JSON.parse(window.sessionStorage.getItem('previewChapter'))
    this.chapter = chapter
    this.fixContent()
    // 加载预设样式
    // this.getPreset(this.chapter.rss.source)
  },

  methods: {
    fixContent () {
      let originalContent = this.chapter.description || ''
      const stylePreset = '<style>img{display: block;margin: 0 auto;max-width: 600px;}video{max-width: 600px;}</style>'
      let rawLinks = originalContent.match(/<a [^>]*href=[^>]*>(.(?!<a))+<\/a>/g)
      if (rawLinks) {
        // console.log('has link', rawLinks)
        let links = []
        rawLinks.forEach(link => {
          links.push({
            text: link.match(/(?<=>).*(?=<\/a>)/),
            link: link.match(/(?<=href=("|'))[^<>"']+(?=("|'))/)[0]
          })
        })
        links.forEach((item) => {
          originalContent = originalContent.replace(/<a [^>]*href=[^>]*>(.(?!<a))+<\/a>/, `<span class="ray-link" onclick="window.openExternalLink('${item.link}')">${item.text}</span>`)
        })
      }
      // console.log(originalContent)
      this.content = stylePreset + originalContent
    },
    // mergeStyle (rules) {
    //   rules.forEach(rule => {
    //     switch (rule.type) {
    //       case 'replace':
    //         console.log(rule.target)
    //         // this.content.replace(rule.target, rule.with)
    //         this.content.replace(rule.target, 'TODO')
    //     }
    //   })
    // },
    view () {
      if (this.chapter.link) {
        shell.openExternal(this.chapter.link)
      }
    },
    back () {
      if (this.backLock) {
        return
      }
      this.backLock = true
      this.$router.go(-1)
    },
    share () {
      if (this.chapter.link) {
        clipboard.writeText(this.chapter.link)
        let notify = new Notification('Chapter Link Copied!', {
          body: `You can paste link and share now`
        })
        notify.onclick = () => {}
      }
    },
    bookmark () {
      if (!this.chapter.id) {
        return
      }
      systemCtrl.addBookmark(this.chapter)
      systemCtrl.saveBookmarks()
      let notify = new Notification('Chapter bookmarked!', {
        body: `You can find this chapter in bookmarks`
      })
      notify.onclick = () => {}
    }
    // getPreset (source) {
    //   getStyleIndex().then(data => {
    //     if (data) {
    //       let indexMap = data
    //       let target = indexMap.find(item => item.url === source || item.url === `${source}/`)
    //       if (target && target.id) {
    //         // 存在预设样式，获取并覆盖当前默认样式
    //         return getStyle(target.id)
    //       }
    //     }
    //   }).then(rules => {
    //     if (rules && rules.length) {
    //       this.mergeStyle(rules)
    //     }
    //   }).catch(err => {
    //     console.warn(err)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.page-view {
  position: relative;
  width: 100%;
  height: 100%;
  .window {
    width: 100%;
    height: 100%;
    background: #eee;
    overflow-y: auto;
    .chapter {
      margin: 30px auto 12px;
      width: 700px;
      padding: 10px 30px;
      background: #fff;
      letter-spacing: 0.6px;
      font-family: 'RobotoSlab Regular';
    }
    .chapter-end {
      margin-bottom: 24px;
      color: #aaa;
      text-align: center;
      font-size: 20px;
      font-family: 'AlexBrush Regular';
    }
    .bottom-btns {
      margin-bottom: 36px;
      text-align: center;
      .btn {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 18px;
        color: #666;
        background: #fff;
        cursor: pointer;
        opacity: 0.7;
        user-select: none;
        transition: all 0.4s;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .box-btns {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0px;
    top: 22px;
    border-bottom-right-radius: 8px;
    overflow: hidden;
    .btn {
      display: flex;
      align-items: center;
      margin-right: 1px;
      height: 30px;
      line-height: 30px;
      padding: 0 6px;
      // border-right: 1px solid #aaa;
      background: #fff;
      transition: all 0.4s;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: rgba(255, 255, 255, .5);
      }
      .h-img {
        // margin-right: 6px;
        height: 12px;
      }
      .w-img {
        width: 12px;
      }
      .n-img {
        max-width: 16px;
        max-height: 16px;
      }
      .text {
        margin-left: 6px;
      }
    }
  }
}
</style>
