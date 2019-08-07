<template>
  <section class="bed-navigation">
    <div class="box-btn">
      <div class="btn" @click="back()">
        <img class="arrow" src="../assets/arrow_left.png" alt="<">
        <img class="icon" src="../assets/home.png" alt="Home">
      </div>
    </div>

    <div class="title">Feeds ({{ system.rssSources.length }})</div>
    <div class="box-feed" :class="[index === system.activeRssIndex ? 'active' : '']" v-for="(feed, index) in system.rssSources" :key="index" @click="changeFeed(index)">
      <img class="icon" :src="feed.icon" alt="">
      {{ feed.title }}
      <img class="arrow" src="../assets/arrow_right.png" alt=">" v-show="index === system.activeRssIndex">
    </div>

    <div class="no-data" v-show="!system.rssSources.length">
      <div class="btn" @click="addFeed()">Add First Feed</div>
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

  methods: {
    changeFeed (index) {
      if (index !== system.activeRssIndex) {
        system.activeRssIndex = index
      }
    },
    addFeed () {
      // TODO
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
