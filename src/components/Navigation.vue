<template>
  <section class="bed-navigation">
    <div class="box-btn">
      <div class="btn" @click="back()">
        <img class="arrow" src="../assets/arrow_left.png" alt="<">
        back
      </div>
    </div>

    <div class="title">Feeds ({{ activeFeeds.length }})</div>
    <div class="box-feed" :class="[feed.id === activeRssId ? 'active' : '']" v-for="(feed) in activeFeeds" :key="feed.id" @click="changeFeed(feed)">
      <img class="icon" :src="feed.icon" alt="">
      {{ feed.title }}
      <img class="arrow" src="../assets/arrow_right.png" alt=">" v-show="feed.id === activeRssId">
    </div>

    <div class="no-data" v-show="!activeFeeds.length">
      <div class="btn" @click="addFeed()">Add Feed</div>
    </div>
  </section>
</template>

<script>
import system from '@/models/system'

export default {
  name: 'navigation',
  data () {
    return {
      system
    }
  },
  computed: {
    activeRssId () {
      if (this.activeFeeds.length && this.system.activeRssIndex > -1) {
        return this.system.rssSources[this.system.activeRssIndex].id
      } else {
        return ''
      }
    },
    activeFeeds () {
      return this.system.rssSources.filter(item => item.active)
    }
  },

  methods: {
    changeFeed (feed) {
      if (feed.id !== this.activeRssId) {
        let index = system.rssSources.findIndex(item => item.id === feed.id)
        system.activeRssIndex = index
      }
    },
    addFeed () {
      this.$router.push({
        name: 'feedsManage'
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.bed-navigation {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  // background: red;
  overflow-y: auto;
  .box-btn {
    display: flex;
    .btn {
      display: flex;
      align-items: center;
      // height: 30px;
      border-bottom-right-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
      user-select: none;
      .arrow {
        margin-right: 6px;
        height: 10px;
      }
      .icon {
        width: 16px;
      }
      &:hover {
        background: #eee;
      }
    }
  }
  .title {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
  }
  .box-feed {
    display: flex;
    align-items: center;
    position: relative;
    // margin-bottom: 6px;
    height: 34px;
    padding: 0 12px;
    color: #666;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    .icon {
      margin-right: 6px;
      max-width: 18px;
      max-height: 18px;
      opacity: 0.6;
    }
    .arrow {
      position: absolute;
      right: 12px;
      top: 12px;
      height: 10px;
    }
    &.active {
      color: #000;
      background: #eee;
      .icon {
        opacity: 1;
      }
    }
  }
  .no-data {
    padding: 16px;
    text-align: center;
    .btn {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(234, 236, 101, .5);
      color: #666;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      transition: all 0.4s;
      &:hover {
        background: rgba(234, 236, 101, 1);
        color: #333;
      }
    }
  }
}
</style>
