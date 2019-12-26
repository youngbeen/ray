<template>
  <section class="page-bookmarks">
    <div class="bed-chapter">
      <div class="no-data" v-show="allBookmarks.length">Total {{ allBookmarks.length }} chapter(s)</div>

      <div class="chapter-item" v-for="chapter in displayChapters" :key="chapter.id">
        <div class="box-chapter" @click="view(chapter)">
          <div class="content" :class="[chapter.avatar ? 'padded' : '']">
            <div class="title">{{ chapter.title }}</div>
            <div class="desc">{{ chapter.plainDescription }}</div>
            <div class="author-tip">
              Length: {{ chapter.plainDescription.length }}
              <div class="date">{{ chapter.pubDateText }}</div>
            </div>

            <div class="btns">
              <div class="btn" v-if="chapter.link" @click.stop="viewOriginal(chapter)">
                <img src="../assets/earth_black.png" alt="">
              </div>
              <div class="btn" @click.stop="deleteBookmark(chapter)">
                <img src="../assets/bin.png" alt="">
              </div>
            </div>
          </div>
          <div class="box-avatar" v-if="chapter.avatar" :style="{ backgroundImage: `url(${chapter.avatar})` }" @click.stop="preview(chapter)">
          </div>
        </div>
      </div>

      <div class="no-data" v-show="!displayChapters.length">No bookmarked chapters</div>
    </div>

    <!-- 悬浮操作 -->
    <div class="box-btns">
      <div class="btn" @click="back()">
        <img class="h-img" src="../assets/arrow_left.png" alt="<">
        <span class="text">Back</span>
      </div>
    </div>
  </section>
</template>

<script>
import { dateUtil } from '@youngbeen/angle-util'
import { shell } from 'electron'
import eventBus from '@/eventBus'
import system from '@/models/system'
import config from '@/models/config'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'pageBookmarks',
  data () {
    return {
      backLock: false,
      savedY: 0, // 保存的滑动top y值
      pageSize: 20,
      system
    }
  },
  computed: {
    displayChapters () {
      return this.allBookmarks.slice(0, this.pageSize * this.system.bookmarkPage)
    },
    allBookmarks () {
      if (this.system.bookmarks.length) {
        let list = this.system.bookmarks.map(item => {
          item.pubDateText = dateUtil.formatDateTime('YYYY-MM-DD HH:mm:ss', item.pubDate)
          return item
        })
        return list
      } else {
        return []
      }
    }
  },

  mounted () {
    let oldY = parseInt(window.sessionStorage.getItem('bookmarksViewY'))
    window.sessionStorage.removeItem('bookmarksViewY')
    if (oldY) {
      document.querySelector('.page-bookmarks').scrollTo(0, oldY)
    }

    document.querySelector('.page-bookmarks').onscroll = () => {
      let scrollTop = document.querySelector('.page-bookmarks').scrollTop
      let scrollHeight = document.querySelector('.page-bookmarks').scrollHeight
      let clientHeight = document.querySelector('.page-bookmarks').clientHeight
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
    if (document.querySelector('.page-bookmarks')) {
      document.querySelector('.page-bookmarks').onscroll = null
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
        window.sessionStorage.setItem('bookmarksViewY', document.querySelector('.page-bookmarks').scrollTop)
        window.sessionStorage.setItem('previewChapter', JSON.stringify(chapter))
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
    deleteBookmark (chapter) {
      if (chapter && chapter.id) {
        systemCtrl.removeBookmark(chapter)
        systemCtrl.saveBookmarks()
      }
    },
    handleLoadMore () {
      if (Math.ceil(this.allBookmarks.length / this.pageSize) > system.bookmarkPage) {
        system.bookmarkPage++
      }
    },
    back () {
      if (this.backLock) {
        return
      }
      this.backLock = true
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.page-bookmarks {
  position: relative;
  height: 100%;
  // border-left: 2px solid #eee;
  // background: blue;
  overflow-y: auto;
  .bed-chapter {
    padding: 26px 36px 16px;
    .chapter-item {
      position: relative;
      transition: all 0.4s;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .box-chapter {
        position: relative;
        padding: 16px 24px;
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
          width: 280px;
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
            margin-left: 270px;
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
          .btns {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 16px;
            padding-top: 8px;
            border-top: 1px solid #eee;
            .btn {
              padding: 4px;
              opacity: 0.5;
              transition: all 0.25s;
              img {
                max-width: 15px;
                max-height: 15px;
              }
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }
      &:hover {
        .box-chapter {
          color: #333;
          box-shadow: 3px 2px 10px 1px rgba(122, 122, 122, .3);
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
  .box-btns {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0px;
    top: 22px;
    border-bottom-right-radius: 8px;
    overflow: hidden;
    z-index: 99;
    .btn {
      display: flex;
      align-items: center;
      margin-right: 1px;
      height: 30px;
      line-height: 30px;
      padding: 0 6px;
      // border-right: 1px solid #aaa;
      background: rgba(238, 238, 238, .5);
      transition: all 0.4s;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: rgba(238, 238, 238, .8);
      }
      .h-img {
        // margin-right: 6px;
        height: 14px;
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
