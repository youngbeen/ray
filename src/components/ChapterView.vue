<template>
  <section class="bed-chapter-view">
    <div id="chapterview-lighthouse"></div>

    <div class="bed-chapter">
      <div class="box-chapter" v-show="currentFeedChapters.length" v-for="chapter in currentFeedChapters" :key="chapter.id" @click="view(chapter)">
        <div class="content" :class="[chapter.avatar ? 'padded' : '']">
          <div class="title">{{ chapter.title }}</div>
          <div class="author-tip">{{ chapter.pubDateText }}</div>
          <div class="desc">{{ chapter.plainDescription }}</div>
          <!-- <p v-html="chapter.description"></p> -->
        </div>
        <div class="box-avatar" v-if="chapter.avatar" :style="{ backgroundImage: `url(${chapter.avatar})` }" @click.stop="preview(chapter)">
          <div class="mask">&nbsp;</div>
        </div>
      </div>

      <div class="no-data" v-show="!currentFeedChapters.length">No chapters found</div>
    </div>

  </section>
</template>

<script>
import { dateUtil } from '@youngbeen/angle-util'
import eventBus from '@/eventBus'
import system from '@/models/system'

export default {
  name: 'chapterView',
  data () {
    return {
      system
    }
  },
  computed: {
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
    }
  },

  mounted () {
    let oldY = parseInt(window.sessionStorage.getItem('feedsViewY'))
    window.sessionStorage.removeItem('feedsViewY')
    if (oldY) {
      document.querySelector('.bed-chapter-view').scrollTo(0, oldY)
    }

    eventBus.$on('scrollToTop', params => {
      if (params.target === 'chapterView') {
        // console.log('should scroll')
        document.querySelector('#chapterview-lighthouse').scrollIntoView()
      }
    })
  },

  methods: {
    view (chapter) {
      window.sessionStorage.setItem('feedsViewY', document.querySelector('.bed-chapter-view').scrollTop)
      let url = chapter.link || ''
      let content = chapter.description || ''
      if (url) {
        window.localStorage.setItem('rayPreviewContent', JSON.stringify(content))
        this.$router.push({
          name: 'read',
          query: {
            url: encodeURIComponent(url)
          }
        })
      } else if (chapter.avatar) {
        // 无访问url，有预览图
        this.preview(chapter)
      }
    },
    preview (chapter) {
      if (chapter.avatar) {
        eventBus.$emit('preview', {
          image: chapter.avatar
        })
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
  .bed-chapter {
    padding: 16px 16px;
    .box-chapter {
      position: relative;
      padding: 18px 24px;
      border-bottom: 1px solid #eee;
      // border-radius: 6px;
      background: #fff;
      color: #333;
      // opacity: 0.8;
      cursor: pointer;
      user-select: none;
      transition: all 0.4s;
      overflow: hidden;
      &:hover {
        background: linear-gradient(45deg, #fff, #ebeaac);
        color: #000;
        // box-shadow: 1px 1px 18px 1px rgba(122, 122, 122, .2);
        // opacity: 1;
      }
      .content {
        &.padded {
          margin-right: 90px;
        }
        .title {
          margin-bottom: 8px;
          font-size: 17px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .author-tip {
          margin-bottom: 6px;
          color: #aaa;
          font-size: 12px;
        }
        .desc {
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .box-avatar {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100px;
        // height: 70px;
        // background: red;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        .mask {
          width: 30px;
          height: 100%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
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
