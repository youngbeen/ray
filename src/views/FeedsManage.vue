<template>
  <section class="page-feeds-manage">
    <div class="box-btn">
      <div class="btn" @click="back()">
        <img class="arrow" src="../assets/arrow_left.png" alt="<">
        Back
      </div>
    </div>

    <!-- 添加 -->
    <div class="box-add-new">
      <input type="text" placeholder="feed source url" v-model="inputUrl">
      <div class="btn" @click="handleAdd()">Add & Follow</div>
    </div>

    <!-- 提示 -->
    <div class="box-tip" :class="[tipActive && 'active']">
      <div class="tip">If a feed continues to fail to load, try refreshing it</div>
    </div>

    <!-- 列表 -->
    <div class="box-list">
      <div class="row-title">
        <div class="btn" :class="[selectedActiveType && 'active']" @click="toggleType(true)">
          Active Feeds
          <span class="badge">{{ system.rssSources.filter(item => item.active).length }}</span>
        </div>
        <div class="btn" :class="[!selectedActiveType && 'active']" @click="toggleType(false)">
          Inactive Feeds
          <span class="badge">{{ system.rssSources.filter(item => !item.active).length }}</span>
        </div>
      </div>

      <div class="rows">
        <div class="row" v-for="feed in currentList" :key="feed.id">
          <div class="box-name">
            <img :src="feed.icon" alt="">
            <div class="name">{{ feed.title }}</div>
          </div>
          <div class="box-source">
            <div class="source">{{ feed.source }}</div>
          </div>
          <div class="desc">{{ feed.description }}</div>
          <div class="box-actions">
            <div class="btn btn-warn" v-if="feed.active" @click="activate(feed, false)">Unfollow</div>
            <div class="btn" v-else @click="activate(feed, true)">Follow</div>
            <!-- <div class="btn" @click="handleEdit()">
              <img src="../assets/edit.png" alt="Edit">
            </div> -->
            <div class="btn" v-show="selectedActiveType" @click="handleRefresh(feed)">
              <img src="../assets/reload.png" alt="Refresh">
            </div>
            <div class="btn" @click="handleDelete(feed)">
              <img src="../assets/bin.png" alt="Delete">
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" v-if="!currentList.length">Not having any feeds</div>
    </div>
  </section>
</template>

<script>
import { parseString } from 'xml2js'
import { getFeeds } from '@/api/system'
import system from '@/models/system'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  data () {
    return {
      loading: false,
      backLock: false,
      tipActive: false, // 是否展示tip
      selectedActiveType: true,
      inputUrl: '',
      system
    }
  },
  computed: {
    currentList () {
      return this.system.rssSources.filter(item => item.active === this.selectedActiveType)
    }
  },

  mounted () {
    setTimeout(() => {
      this.tipActive = true
      setTimeout(() => {
        this.tipActive = false
      }, 1000 * 10)
    }, 1000 * 3)
  },

  methods: {
    toggleType (type) {
      this.selectedActiveType = type
    },
    activate (feed, value) {
      if (feed && feed.id) {
        let index = system.rssSources.findIndex(item => item.id === feed.id)
        if (value) {
          // 激活feed
          system.loading = this.loading = true
          getFeeds(feed.source).then(data => {
            // console.log(data)
            system.loading = this.loading = false
            parseString(data, {
              trim: true,
              ignoreAttrs: true
            }, (err, result) => {
              console.log(err, result)
              if (err) {
                let notify = new Notification('Connection failed!', {
                  body: `The feed source has some errors`
                })
                notify.onclick = () => {}
                return
              }
              system.rssSources[index].active = value
              systemCtrl.saveRssSubscribes()
              systemCtrl.addChapters(result)
            })
          }).catch(err => {
            console.warn(err)
            system.loading = this.loading = false
            let notify = new Notification('Connection failed!', {
              body: `Connection failed!`
            })
            notify.onclick = () => {}
          })
        } else {
          // unfollow feed
          system.rssSources[index].active = value
          systemCtrl.saveRssSubscribes()
          systemCtrl.removeChapters(feed.id)
        }
      }
    },
    // handleEdit () {
    // },
    handleRefresh (feed) {
      this.handleDelete(feed)
      this.handleAdd(feed.source, feed)
    },
    handleDelete (feed) {
      if (feed && feed.id) {
        let index = system.rssSources.findIndex(item => item.id === feed.id)
        system.rssSources.splice(index, 1)
        systemCtrl.removeChapters(feed.id)
        systemCtrl.saveRssSubscribes()
      }
    },
    handleAdd (url = '', feedBackup = '') {
      this.inputUrl = this.inputUrl.replace(/\s|\n|\r/g, '')
      url = url || this.inputUrl
      if (this.loading || !url) {
        return
      }
      let targetIndex = system.rssSources.findIndex(item => item.source === url || `${item.source}/` === url || item.source === `${url}/`)
      if (targetIndex > -1) {
        // 尝试添加一个已经添加过的feed
        if (system.rssSources[targetIndex].active) {
          // 已激活了该feed
          console.log('已激活的feed')
          window.alert('You have already followed this feed')
        } else {
          // 添加的feed，但处于未激活状态，直接激活
          console.log('添加过但未激活的feed')
          // 重新Follow feed,需要抓取其文章
          system.loading = this.loading = true
          getFeeds(system.rssSources[targetIndex].source).then(data => {
            // console.log(data)
            system.loading = this.loading = false
            parseString(data, {
              trim: true,
              ignoreAttrs: true
            }, (err, result) => {
              console.log(err, result)
              if (err) {
                let notify = new Notification('Connection failed!', {
                  body: `The feed source has some errors`
                })
                notify.onclick = () => {}
                return
              }
              system.rssSources[targetIndex].active = true
              systemCtrl.saveRssSubscribes()
              systemCtrl.addChapters(result)
            })
          }).catch(err => {
            console.warn(err)
            system.loading = this.loading = false
            let notify = new Notification('Connection failed!', {
              body: `Connection failed!`
            })
            notify.onclick = () => {}
          })
        }
        this.inputUrl = ''
      } else {
        // 添加一个新feed
        system.loading = this.loading = true
        getFeeds(url).then(data => {
          // console.log(data)
          system.loading = this.loading = false
          parseString(data, {
            trim: true,
            ignoreAttrs: true
          }, (err, result) => {
            console.log(err, result)
            if (err) {
              let notify = new Notification('Connection failed!', {
                body: `The feed source has some errors`
              })
              notify.onclick = () => {}
              return
            }
            systemCtrl.addRssSubscribes(result, url)
            systemCtrl.saveRssSubscribes()
            systemCtrl.addChapters(result)
            this.inputUrl = ''
          })
        }).catch(err => {
          console.warn(err)
          system.loading = this.loading = false
          let notify = new Notification('Connection failed!', {
            body: `Please check the source url`
          })
          notify.onclick = () => {}
          if (feedBackup) {
            // 添加失败，且存在feed备份。则恢复feed
            system.rssSources.push(feedBackup)
            systemCtrl.saveRssSubscribes()
          }
        })
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
.page-feeds-manage {
  .box-btn {
    display: flex;
    .btn {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      border-bottom-right-radius: 8px;
      transition: all 0.4s;
      padding: 6px 12px;
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
  .box-add-new {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 2px solid #eee;
    // background: red;
    input {
      width: 1000px;
      height: 32px;
      padding: 0 6px;
      border: 1px solid #999;
      border-radius: 6px;
      color: #333;
      font-size: 13px;
    }
    .btn {
      padding: 6px 12px;
      border-radius: 20px;
      background: rgba(234, 236, 101, .5);
      color: #666;
      font-size: 13px;
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
  .box-tip {
    height: 0;
    background: #dedeff;
    overflow: hidden;
    transition: height 0.4s linear;
    .tip {
      height: 24px;
      line-height: 24px;
      padding: 0 24px;
      color: #888888;
      font-size: 12px;
    }
    &.active {
      height: 24px;
    }
  }
  .box-list {
    padding: 12px 24px;
    .row-title {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #eee;
      // box-shadow: 0px 8px 4px 0px rgba(122, 122, 122, .1);
      .btn {
        margin-right: 6px;
        // height: 100%;
        padding: 6px 6px;
        color: #999;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        border-bottom: 2px solid rgba(0, 0, 0, 0);
        &.active {
          color: #333;
          border-bottom: 2px solid #333;
        }
        .badge {
          padding: 0 6px;
          border-radius: 12px;
          background: #eee;
          font-size: 11px;
        }
      }
    }
    .rows {
      max-height: 520px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: rgba(#ccc, .8);
      }
      .row {
        display: flex;
        justify-content: space-between;
        height: 40px;
        // background: red;
        border-bottom: 1px solid #eee;
        font-size: 13px;
        .box-name {
          display: flex;
          align-items: center;
          width: 20%;
          img {
            margin-right: 6px;
            max-width: 14px;
            max-height: 14px;
          }
          .name {
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .box-source {
          width: 30%;
          .source {
            line-height: 40px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .desc {
          width: 30%;
          line-height: 40px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .box-actions {
          display: flex;
          align-items: center;
          width: 16%;
          .btn {
            display: flex;
            align-items: center;
            margin-right: 6px;
            height: 24px;
            padding: 0 8px;
            // border: 1px solid #ccc;
            border-radius: 20px;
            color: #333;
            background: #ddd;
            font-size: 12px;
            font-weight: 500;
            opacity: 0.6;
            transition: all 0.4s;
            cursor: pointer;
            user-select: none;
            &.btn-warn {
              color: #fff;
              background: #d8473d;
            }
            &:hover {
              opacity: 1;
            }
            img {
              max-width: 12px;
              max-height: 12px;
            }
          }
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
</style>
