<template>
  <section class="bed-chapter-view">
    <div class="bed-chapter">
      <div class="box-chapter" v-show="currentFeedChapters.length" v-for="chapter in currentFeedChapters" :key="chapter.id" @click="view(chapter)">
        <div class="content" :class="[chapter.avatar ? 'padded' : '']">
          <div class="title">{{ chapter.title }}</div>
          <div class="author-tip">{{ chapter.pubDate }}</div>
          <div class="desc">{{ chapter.plainDescription }}</div>
          <!-- <p v-html="chapter.description"></p> -->
        </div>
        <div class="box-avatar" v-if="chapter.avatar" :style="{ backgroundImage: `url(${chapter.avatar})` }">
          <div class="mask">&nbsp;</div>
        </div>
      </div>

      <div class="no-data" v-show="!currentFeedChapters.length">- No chapters found -</div>
    </div>

  </section>
</template>

<script>
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
      if (this.system.chapters.length && this.system.rssSources.length) {
        let currentChannel = this.system.chapters.find(item => item.rssId === this.system.rssSources[this.system.activeRssIndex].id)
        if (currentChannel) {
          return currentChannel.list || []
        } else {
          return []
        }
      } else {
        return []
      }
    }
  },

  methods: {
    view (chapter) {
      let url = chapter.link || ''
      console.log(url)
      if (url) {
        this.$router.push({
          name: 'read',
          query: {
            url: encodeURIComponent(url)
          }
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
      padding: 10px 16px;
      border: 1px solid #aaa;
      border-radius: 6px;
      color: #333;
      // opacity: 0.8;
      cursor: pointer;
      user-select: none;
      transition: all 0.4s;
      overflow: hidden;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      &:hover {
        background: linear-gradient(45deg, #fff, #ebeaac);
        color: #000;
        box-shadow: 1px 1px 18px 1px rgba(122, 122, 122, .2);
        // opacity: 1;
      }
      .content {
        &.padded {
          margin-right: 90px;
        }
        .title {
          margin-bottom: 6px;
          font-size: 17px;
          font-weight: 500;
        }
        .author-tip {
          margin-bottom: 6px;
          color: #aaa;
          font-size: 10px;
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
      padding-top: 40px;
      color: #666;
      text-align: center;
      font-size: 13px;
    }
  }
}
</style>
