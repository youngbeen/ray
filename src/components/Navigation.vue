<template>
  <section class="bed-navigation">
    <div class="box-btn">
      <div class="btn" @click="back()">
        <font-awesome-icon :icon="['fas', 'chevron-left']" /> &nbsp;Back
      </div>
    </div>

    <div class="title" @mouseover="handleMouseover()" @mouseout="handleMouseout()">
      Feeds ({{ activeFeeds.length }})
      <div class="box-btns" :style="{ 'opacity': isTitleFocus ? '1' : '0' }">
        <div class="btn" @click="addFeed()">manage</div>
        |
        <div class="btn" @click="syncAll()">update all</div>
      </div>
    </div>
    <div class="box-feed" :class="[feed.id === activeRssId ? 'active' : '']" draggable v-for="(feed) in activeFeeds" :key="feed.id" @dragstart="handleDragstart($event, feed)" @dragover.prevent="handleDragover" @drop.prevent="handleDrop($event, feed)" @click="changeFeed(feed)">
      <img class="icon" :src="feed.icon" alt="">
      {{ feed.title }}
      <font-awesome-icon :icon="['fas', 'sync-alt']" class="fresh" @click.stop="handleSync(feed)" />
      <font-awesome-icon :icon="['fas', 'chevron-right']" class="arrow" v-show="feed.id === activeRssId" />
    </div>

    <div class="no-data" v-show="!activeFeeds.length">
      <div class="btn" @click="addFeed()">Add Feed</div>
    </div>
  </section>
</template>

<script>
import eventBus from '@/eventBus'
import system from '@/models/system'
import dataCtrl from '@/ctrls/dataCtrl'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'navigation',
  data () {
    return {
      backLock: false,
      isTitleFocus: false,
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
        system.page = 1
        setTimeout(() => {
          eventBus.$emit('scrollToTop', {
            target: 'chapterView'
          })
        }, 100)
      }
    },
    addFeed () {
      this.$router.push({
        name: 'feedsManage'
      })
    },
    handleSync (feed) {
      // console.log(feed)
      if (feed && feed.id && feed.source) {
        dataCtrl.updateFeed(feed)
      }
    },
    syncAll () {
      dataCtrl.updateAllFeeds()
    },
    handleDragstart (e, feed) {
      // console.log('start', feed)
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.setData('sourceFeed', JSON.stringify(feed))
    },
    handleDragover (e) {
      // console.log('over', e)
      e.dataTransfer.dropEffect = 'move'
    },
    handleDrop (e, feed) {
      // console.log('drop', feed)
      e.dataTransfer.dropEffect = 'move'
      // 变换位置
      let sourceFeed = JSON.parse(e.dataTransfer.getData('sourceFeed'))
      if (sourceFeed.id === feed.id) {
        return
      }
      let sourceIndex = system.rssSources.findIndex(item => item.id === sourceFeed.id)
      let item = system.rssSources.splice(sourceIndex, 1)[0]
      let targetIndex = system.rssSources.findIndex(item => item.id === feed.id)
      system.rssSources.splice(targetIndex, 0, item)
      systemCtrl.saveRssSubscribes()
    },
    back () {
      if (this.backLock) {
        return
      }
      this.backLock = true
      this.$router.go(-1)
    },
    handleMouseover () {
      this.isTitleFocus = true
    },
    handleMouseout () {
      this.isTitleFocus = false
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
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: rgba(#ccc, .8);
  }
  .box-btn {
    display: flex;
    .btn {
      display: flex;
      align-items: center;
      // height: 30px;
      padding: 6px 12px;
      border-bottom-right-radius: 8px;
      transition: all 0.4s;
      cursor: pointer;
      user-select: none;
      .arrow {
        margin-right: 6px;
        height: 14px;
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
    position: relative;
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    font-weight: 500;
    .box-btns {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      padding: 0 12px;
      color: #aaa;
      transition: all 0.4s;
      .btn {
        margin: 0 3px;
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
  }
  .box-feed {
    display: flex;
    align-items: center;
    position: relative;
    // margin-bottom: 6px;
    height: 34px;
    padding: 0 12px;
    color: #666;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.4s;
    cursor: pointer;
    user-select: none;
    .icon {
      margin-right: 6px;
      max-width: 16px;
      max-height: 16px;
      opacity: 0.6;
    }
    .fresh {
      position: absolute;
      right: 32px;
      top: 10px;
      width: 18px;
      opacity: 0;
      transition: all 0.1s;
    }
    .arrow {
      position: absolute;
      right: 12px;
      top: 11px;
      width: 12px;
      height: 12px;
      line-height: 12px;
      // font-size: 11px;
      // height: 10px;
    }
    &.active {
      color: #000;
      background: #eee;
      .icon {
        opacity: 1;
      }
    }
    &:hover {
      .fresh {
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
