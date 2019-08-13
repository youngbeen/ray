<template>
  <div id="app">
    <div class="title-bar">Ray</div>

    <div class="container">
      <router-view/>
    </div>

    <image-preview></image-preview>
    <loading></loading>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import system from '@/models/system'
import config from '@/models/config'
import systemCtrl from '@/ctrls/systemCtrl'
import dataCtrl from '@/ctrls/dataCtrl'
import ImagePreview from '@/components/ImagePreview.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'app',

  mounted () {
    // 读取本地存储的配置信息
    let savedConfig = systemCtrl.readConfig()
    console.log('config', config)
    Object.assign(config, savedConfig)
    // 读取本地存储的RSS订阅源
    system.rssSources = systemCtrl.readRssSubscribes()
    this.getAllFeeds()

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
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
.title-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 22px;
  line-height: 22px;
  background: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  -webkit-app-region: drag;
  user-select: none;
  z-index: 9999;
}
.container {
  height: calc(100% - 22px);
  padding-top: 22px;
}
</style>
