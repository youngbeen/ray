<template>
  <div id="app">
    <title-bar></title-bar>

    <div class="container">
      <transition :name="transitionType">
        <router-view/>
      </transition>
    </div>

    <image-preview></image-preview>
    <loading></loading>
  </div>
</template>

<script>
import { ipcRenderer, shell } from 'electron'
import system from '@/models/system'
import config from '@/models/config'
import systemCtrl from '@/ctrls/systemCtrl'
import dataCtrl from '@/ctrls/dataCtrl'
import TitleBar from '@/components/TitleBar.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'app',
  data () {
    return {
      transitionType: ''
    }
  },
  watch: {
    $route (to, from) {
      if (to.meta.index > from.meta.index) {
        // 前进状态,反之则为后退状态
        this.transitionType = 'slide-left'
      } else {
        // 后退状态
        this.transitionType = 'slide-right'
      }
    }
  },

  mounted () {
    // 读取本地存储的配置信息
    let savedConfig = systemCtrl.readConfig()
    console.log('config', config)
    Object.assign(config, savedConfig)
    // 读取本地存储的RSS订阅源
    system.rssSources = systemCtrl.readRssSubscribes()
    this.getAllFeeds()
    // 读取本地存储的书签文章
    let savedBookmarks = systemCtrl.readBookmarks()
    system.bookmarks = savedBookmarks

    // 自动更新文章
    setInterval(() => {
      console.log('starting fetching all feeds chapters...')
      this.getAllFeeds(true)
    }, 1000 * 60 * 60 * config.autoFetchInterval)

    ipcRenderer.on('sys_export_trigger', () => {
      ipcRenderer.send('asynchronous-message', {
        type: 'sys_export_file',
        content: window.localStorage.getItem('raySavedRssFeeds')
      })
    })
    ipcRenderer.on('sys_importdata', (e, content, type) => {
      // console.log(content, type)
      this.importData(content)
    })

    window.openExternalLink = (link) => {
      shell.openExternal(link)
    }
  },

  methods: {
    getAllFeeds (noLoading = false) {
      dataCtrl.updateAllFeeds(noLoading)
    },
    importData (content) {
      console.log(content)
      if (!content) {
        return
      }
      // 将导入的feed数据合并到当前feeds数据中，以source为判重依据
      let newFeeds = JSON.parse(content)
      let duplicatedCount = 0
      newFeeds.forEach(f => {
        let targetIndex = system.rssSources.findIndex(item => item.source === f.source || `${item.source}/` === f.source || item.source === `${f.source}/`)
        if (targetIndex > -1) {
          // 重复的feed，不做处理
          duplicatedCount++
        } else {
          // 新feed，统一添加到不激活队列中
          f.active = false
          system.rssSources.push(f)
        }
      })
      systemCtrl.saveRssSubscribes()
      let notify = new Notification('Imported Successfully!', {
        body: `New feeds added, ${duplicatedCount} already exists`
      })
      notify.onclick = () => {}
    }
  },

  components: {
    TitleBar,
    ImagePreview,
    Loading
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}
// body {
//   -webkit-app-region: drag;
// }
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  cursor: default;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
.container {
  height: calc(100% - 22px);
  padding-top: 22px;
}
// 定义动画类
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  position: absolute;
  will-change: transform;
  // transition: all 0.5s;
  transition: all 0.6s ease-out;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0) scale(0.7);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0) scale(0.7);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0) scale(0.7);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0) scale(0.7);
}
// common styles
.bold {
  font-weight: bold;
}
.ray-link {
  padding: 0 2px;
  border-radius: 6px;
  border: 1px dashed #ccc;
  color: #3366aa;
  cursor: pointer;
  transition: all 0.4s;
  &:hover {
    background: rgb(96, 204, 255);
  }
}
</style>
