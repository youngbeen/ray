<template>
  <section class="page-config">
    <div class="box-btn">
      <div class="btn" @click="back()">
        <img class="arrow" src="../assets/arrow_left.png" alt="<">
        back
      </div>
    </div>

    <div class="bed-config">
      <div class="box-config">
        <div class="title">Chapter Reading Peference</div>
        <input type="radio" id="pefer-original-false" :value="false" v-model="config.peferOriginal">
        <label for="pefer-original-false">Read in app (default)</label>
        <input type="radio" id="pefer-original-true" :value="true" v-model="config.peferOriginal">
        <label for="pefer-original-true">Read in browser</label>
      </div>
      <div class="box-config">
        <div class="title">Minimum Posters Number</div>
        <input type="radio" id="min-poster-number-5" :value="5" v-model="config.minPostersCount">
        <label for="min-poster-number-5">5 (default)</label>
        <input type="radio" id="min-poster-number-10" :value="10" v-model="config.minPostersCount">
        <label for="min-poster-number-10">10</label>
      </div>
      <div class="box-config">
        <div class="title">Poster Auto-Toggle Interval Time</div>
        <input type="radio" id="poster-intervalr-5" :value="5" v-model="config.posterInterval">
        <label for="poster-intervalr-5">5 seconds (default)</label>
        <input type="radio" id="poster-intervalr-8" :value="8" v-model="config.posterInterval">
        <label for="poster-intervalr-8">8 seconds</label>
        <input type="radio" id="poster-intervalr-10" :value="10" v-model="config.posterInterval">
        <label for="poster-intervalr-10">10 seconds</label>
      </div>
      <div class="box-config">
        <input type="radio" id="auto-fetch-1" :value="1" v-model="config.autoFetchInterval">
        <label for="auto-fetch-1">1 hour</label>
        <div class="title">Feeds Auto-Update Interval Time</div>
        <input type="radio" id="auto-fetch-4" :value="4" v-model="config.autoFetchInterval">
        <label for="auto-fetch-4">4 hours (default)</label>
      </div>
    </div>
  </section>
</template>

<script>
import config from '@/models/config'
import systemCtrl from '@/ctrls/systemCtrl'

export default {
  name: 'config',
  data () {
    return {
      config
    }
  },
  watch: {
    'config': {
      handler: () => {
        // 当配置更改时，保存配置
        console.log('config changed')
        systemCtrl.saveConfig()
      },
      deep: true
    }
  },

  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.page-config {
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
  .bed-config {
    padding: 16px 32px;
    // background: #eee;
    .box-config {
      position: relative;
      margin-bottom: 32px;
      padding: 16px 16px 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      .title {
        position: absolute;
        display: inline-block;
        left: 12px;
        top: -10px;
        padding: 0 6px;
        background: #fff;
        color: #999;
        font-size: 13px;
        font-weight: 500;
      }
      label {
        display: inline-block;
        margin-left: 3px;
        margin-right: 30px;
        min-width: 30px;
        color: #333;
        font-weight: 500;
        user-select: none;
      }
    }
  }
}
</style>
