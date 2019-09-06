<template>
  <div class="page-home">
    <poster-wall></poster-wall>

    <div class="box-container">
      <!-- 最新文章 -->
      <div class="box-seg">
        <div class="title">
          Latest
          <div class="btn" @click="go()">view all</div>
        </div>
        <div class="row" v-for="l in lastestList" :key="l.id" @click="view(l)">
          <img :src="l.icon" alt="">
          <div class="text">{{ l.title }}</div>
        </div>
      </div>

      <!-- 关注的源 -->
      <div class="box-seg">
        <div class="title">
          Feeds
          <div class="btn" @click="go()">view all</div>
        </div>
        <div class="row" v-for="(feed) in activeFeeds" :key="feed.id" @click="go(feed)">
          <img :src="feed.icon" alt="">
          <div class="text">{{ feed.title }}</div>
        </div>
      </div>

      <!-- 功能 -->
      <div class="box-seg">
        <!-- <div class="title">Feeds</div> -->
        <div class="row" v-if="activeFeeds.length" @click="addFeed()">
          <img src="../assets/plus.png" alt="+">
          <div class="text">Add New Rss Feed</div>
        </div>
        <div class="row" @click="goConfig()">
          <img src="../assets/gear.png" alt="">
          <div class="text">System Config</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus'
import system from '@/models/system'
import PosterWall from '@/components/PosterWall'

export default {
  name: 'home',
  data () {
    return {
      system
    }
  },
  computed: {
    lastestList () {
      if (this.system.chapters.length) {
        let plainList = JSON.parse(JSON.stringify(this.system.chapters.reduce((soFar, cat) => {
          return [...soFar, ...cat.list]
        }, [])))
        plainList.sort((a, b) => b.pubDate - a.pubDate)
        return plainList.slice(0, 10)
      } else {
        return []
      }
    },
    activeFeeds () {
      let list = this.system.rssSources.filter(item => item.active)
      return list.slice(0, 10)
    }
  },

  methods: {
    view (chapter) {
      let url = chapter.link || ''
      let content = chapter.description || ''
      if (content) {
        // 使用app内浏览访问
        window.localStorage.setItem('rayPreviewContent', JSON.stringify(content))
        system.readingChapter = {
          icon: chapter.icon,
          author: chapter.author,
          title: chapter.title
        }
        this.$router.push({
          name: 'read',
          query: {
            url: encodeURIComponent(url)
          }
        })
      } else if (chapter.avatar) {
        // 有预览图
        this.preview(chapter)
      }
    },
    preview (chapter) {
      if (chapter.avatar) {
        eventBus.$emit('preview', {
          image: chapter.avatar
        })
      }
    },
    go (feed) {
      if (feed && feed.id) {
        let index = system.rssSources.findIndex(item => item.id === feed.id)
        system.activeRssIndex = index
      }
      this.$router.push({
        name: 'feeds'
      })
    },
    addFeed () {
      this.$router.push({
        name: 'feedsManage'
      })
    },
    goConfig () {
      this.$router.push({
        name: 'config'
      })
    }
  },

  components: {
    PosterWall
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  position: relative;
  min-height: 100%;
  background: #fafafa;
  .box-container {
    display: flex;
    justify-content: space-around;
    padding: 24px 24px;
    .box-seg {
      width: 30%;
      height: auto;
      // border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
      box-shadow: 1px 1px 8px 1px rgba(122, 122, 122, .2);
      overflow: hidden;
      .title {
        position: relative;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        border-bottom: 1px solid #eee;
        font-size: 14x;
        font-weight: 500;
        .btn {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0 12px;
          // background: red;
          color: rgb(102, 102, 102);
          font-size: 12px;
          font-weight: normal;
          cursor: pointer;
          user-select: none;
          &:hover {
            color: #a7a844;
          }
        }
      }
      .row {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 0 12px;
        border-bottom: 1px solid #eee;
        transition: all 0.4s;
        cursor: pointer;
        user-select: none;
        img {
          margin-right: 6px;
          max-width: 14px;
          max-height: 14px;
        }
        .text {
          // width: 100%;
          color: #666;
          font-size: 13px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          background: #eee;
          .text {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
