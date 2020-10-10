<template>
  <section class="bed-chapter-view">
    <div id="chapterview-lighthouse"></div>

    <div class="bed-chapter">
      <div class="no-data" v-show="currentFeedUpdateTime">Last updated: {{ currentFeedUpdateTime | readableTime }}</div>

      <div class="chapter-item" v-for="chapter in displayChapters" :key="chapter.id">
        <div class="box-chapter" @click="view(chapter)">
          <div class="content" :class="[chapter.avatar ? 'padded' : '']">
            <div class="title">{{ chapter.title }}</div>
            <div class="desc">{{ chapter.plainDescription }}</div>
            <div class="author-tip">
              Length: {{ chapter.plainDescription.length }}
              <div class="date">{{ chapter.pubDateText }}</div>
            </div>
            <!-- <p v-html="chapter.description"></p> -->
          </div>
          <div class="box-avatar" v-if="chapter.avatar" :style="{ backgroundImage: `url(${chapter.avatar})` }" @click.stop="preview(chapter)">
          </div>
        </div>

        <div class="btn-view" :class="[!chapter.link && 'invalid']" @click.stop="viewOriginal(chapter)">
          <img src="../assets/earth.png" alt="">
        </div>
      </div>

      <div class="no-data" v-show="!displayChapters.length">No chapters found</div>
    </div>
  </section>
</template>

<script>
import { dateUtil } from '@youngbeen/angle-util'
import { shell } from 'electron'
import eventBus from '@/eventBus'
import system from '@/models/system'
import config from '@/models/config'
import filterCtrl from '@/ctrls/filterCtrl'

export default {
  name: 'chapterView',
  data () {
    return {
      nowTime: new Date(), // 当前时间，用于动态显示时间差
      savedY: 0, // 保存的滑动top y值
      pageSize: 20,
      tc: null,
      system
    }
  },
  computed: {
    displayChapters () {
      return this.currentFeedChapters.slice(0, this.pageSize * this.system.page)
    },
    currentFeedChapters () {
      if (this.system.chapters.length && this.system.rssSources.filter(f => f.active).length && this.system.activeRssIndex > -1) {
        let currentChannel = this.system.chapters.find(item => item.rssId === this.system.rssSources[this.system.activeRssIndex].id)
        if (currentChannel) {
          let list = currentChannel.list || []
          list = list.map(item => {
            item.pubDateText = dateUtil.formatDateTime('YYYY-MM-DD HH:mm:ss', item.pubDate)
            return item
          })
          return list
        } else {
          return []
        }
      } else {
        return []
      }
    },
    currentFeedUpdateTime () {
      if (this.system.chapters.length && this.system.rssSources.filter(f => f.active).length && this.system.activeRssIndex > -1) {
        let currentChannel = this.system.chapters.find(item => item.rssId === this.system.rssSources[this.system.activeRssIndex].id)
        if (currentChannel) {
          let time = currentChannel.updateTime || ''
          if (time) {
            return Math.round((this.nowTime.getTime() - (new Date(time)).getTime()) / 1000)
          } else {
            return ''
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  filters: {
    readableTime: filterCtrl.readableTime
  },

  mounted () {
    let oldY = parseInt(window.sessionStorage.getItem('feedsViewY'))
    window.sessionStorage.removeItem('feedsViewY')
    if (oldY) {
      document.querySelector('.bed-chapter-view').scrollTo(0, oldY)
    }

    // auto update time
    this.tc = setInterval(() => {
      this.nowTime = new Date()
    }, 1000 * 60 * 5)

    eventBus.$on('scrollToTop', params => {
      if (params.target === 'chapterView') {
        // console.log('should scroll')
        document.querySelector('#chapterview-lighthouse').scrollIntoView()
      }
    })

    document.querySelector('.bed-chapter-view').onscroll = () => {
      let scrollTop = document.querySelector('.bed-chapter-view').scrollTop
      let scrollHeight = document.querySelector('.bed-chapter-view').scrollHeight
      let clientHeight = document.querySelector('.bed-chapter-view').clientHeight
      if (scrollTop <= this.savedY) {
        // 下滑中，不需要触发
      } else {
        // 上滑中，可能触发
        if (scrollHeight && clientHeight) {
          let maxScroll = scrollHeight - clientHeight
          if (scrollTop > maxScroll - 10) {
            // console.log('reached')
            this.handleLoadMore()
          }
        }
      }
      this.savedY = scrollTop
    }
  },

  beforeDestroy () {
    clearInterval(this.tc)
    eventBus.$off('scrollToTop')
    if (document.querySelector('.bed-chapter-view')) {
      document.querySelector('.bed-chapter-view').onscroll = null
    }
  },

  methods: {
    view (chapter) {
      let url = chapter.link || ''
      let content = chapter.description || ''
      if (config.peferOriginal && url) {
        // 使用浏览器打开
        shell.openExternal(url)
      } else if (content) {
        // 使用app内浏览访问
        window.sessionStorage.setItem('feedsViewY', document.querySelector('.bed-chapter-view').scrollTop)
        window.sessionStorage.setItem('previewChapter', JSON.stringify(Object.assign({}, chapter, { rss: system.rssSources[system.activeRssIndex] })))
        system.readingChapter = {
          icon: chapter.icon,
          author: chapter.author,
          title: chapter.title
        }
        this.$router.push({
          name: 'read'
        })
      } else if (chapter.avatar) {
        // 有预览图
        this.preview(chapter)
      }
    },
    viewOriginal (chapter) {
      if (chapter && chapter.link) {
        shell.openExternal(chapter.link)
      }
    },
    preview (chapter) {
      if (chapter.avatar) {
        eventBus.$emit('preview', {
          image: chapter.avatar
        })
      }
    },
    handleLoadMore () {
      if (Math.ceil(this.currentFeedChapters.length / this.pageSize) > system.page) {
        system.page++
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bed-chapter-view {
  margin-left: 300px;
  height: 100%;
  // border-left: 2px solid #eee;
  // background: blue;
  box-shadow: -1px 0px 18px 1px rgba(122, 122, 122, .2);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(#ccc, .8);
  }
  .bed-chapter {
    padding: 16px 36px;
    .chapter-item {
      position: relative;
      left: 0;
      padding-right: 36px;
      transition: all 0.4s;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .box-chapter {
        position: relative;
        padding: 18px 24px;
        // border-bottom: 1px solid #eee;
        // border-radius: 6px;
        background: #fff;
        color: #555;
        // opacity: 0.8;
        user-select: none;
        box-shadow: 0px 0px 4px 1px rgba(122, 122, 122, .2);
        transition: all 0.2s;
        overflow: hidden;
        z-index: 2;
        .box-avatar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 200px;
          // height: 70px;
          // background: red;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          // .mask {
          //   width: 30px;
          //   height: 100%;
          //   background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
          // }
        }
        .content {
          &.padded {
            margin-left: 190px;
          }
          .title {
            margin-bottom: 8px;
            font-size: 17px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .desc {
            margin-bottom: 10px;
            font-size: 13px;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .author-tip {
            position: relative;
            color: #aaa;
            // text-align: right;
            font-size: 11px;
            .date {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
      .btn-view {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 40px;
        top: 0;
        bottom: 0;
        width: 40px;
        background: #b2cbe6;
        box-shadow: 0 0 4px 0 rgba(122, 122, 122, .2);
        cursor: pointer;
        opacity: 0;
        transition: all 0.4s;
        z-index: 1;
        img {
          width: 20px;
        }
      }
      &:hover {
        // left: 2px;
        .box-chapter {
          color: #333;
          box-shadow: 3px 2px 10px 1px rgba(122, 122, 122, .3);
        }
        .btn-view {
          right: 0;
          opacity: 1;
          &.invalid {
            opacity: 0;
          }
        }
      }
    }
    .no-data {
      padding: 12px;
      color: #666;
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
