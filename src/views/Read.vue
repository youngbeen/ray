<template>
  <div class="page-view">
    <div class="window">
      <!-- <iframe v-if="url" :src="url" frameborder="0"></iframe> -->
      <div v-html="content"></div>
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
import system from '@/models/system'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'pageView',
  data () {
    return {
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
  },

  methods: {
    fixContent () {
      let originalContent = this.chapter.description || ''
      const stylePreset = '<style>img{display: block;margin: 0 auto;max-width: 600px;}</style>'
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
      this.content = stylePreset + originalContent
    },
    view () {
      if (this.chapter.link) {
        shell.openExternal(this.chapter.link)
      }
    },
    back () {
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
    },
    test () {
      console.log('test')
    }
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
    iframe {
      width: 100%;
      height: 100%;
    }
    div {
      margin: 30px auto 60px;
      width: 700px;
      padding: 10px 30px;
      background: #fff;
      letter-spacing: 1px;
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
