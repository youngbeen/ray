<template>
  <div class="page-view">
    <div class="window">
      <!-- <iframe v-if="url" :src="url" frameborder="0"></iframe> -->
      <div v-html="content"></div>
    </div>

    <div class="btn-back" @click="back()">
      <img src="../assets/arrow_left.png" alt="<">
      back
    </div>

    <div class="btn-browse" v-if="url" @click="view()">
      <img src="../assets/view.png" alt="">
      View Original
    </div>
  </div>
</template>

<script>
import { shell } from 'electron'

export default {
  name: 'pageView',
  data () {
    return {
      url: '',
      content: ''
    }
  },

  mounted () {
    const query = this.$route.query

    if (query.url) {
      this.url = decodeURIComponent(query.url)
    }
    this.content = JSON.parse(window.localStorage.getItem('rayPreviewContent'))
  },

  methods: {
    view () {
      if (this.url) {
        shell.openExternal(this.url)
      }
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-view {
  position: relative;
  width: 100%;
  height: 100%;
  .window {
    width: 100%;
    height: 100%;
    iframe {
      width: 100%;
      height: 100%;
    }
    div {
      padding-top: 30px;
    }
  }
  .btn-back {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0px;
    top: 22px;
    // width: 30px;
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    border-bottom-right-radius: 8px;
    background: rgba(238, 238, 238, .5);
    transition: all 0.4s;
    cursor: pointer;
    user-select: none;
    &:hover {
      background: rgba(238, 238, 238, .8);
    }
    img {
      margin-right: 6px;
      height: 12px;
    }
  }
  .btn-browse {
    display: flex;
    align-items: center;
    position: fixed;
    left: 80px;
    top: 22px;
    // width: 30px;
    height: 30px;
    line-height: 30px;
    padding: 0 6px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background: rgba(238, 238, 238, .5);
    transition: all 0.4s;
    cursor: pointer;
    user-select: none;
    &:hover {
      background: rgba(238, 238, 238, .8);
    }
    img {
      margin-right: 6px;
      width: 16px;
    }
  }
}
</style>
