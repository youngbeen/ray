<template>
  <section class="bed-title-bar">
    <div class="box-title">
      <img v-show="chapterInfo.icon" :src="chapterInfo.icon" alt="">
      <div id="title-marquee" class="title">
        <div>Ray</div>
        <!-- <marquee id="title-marquee" direction="left" behavior="alternate" scrollamount="1">Ray</marquee> -->
      </div>
    </div>
  </section>
</template>

<script>
import system from '@/models/system'
export default {
  name: 'titleBar',
  data () {
    return {
      chapterInfo: {
        icon: '',
        author: '',
        title: ''
      },
      system
    }
  },
  watch: {
    'system.readingChapter': {
      handler (val) {
        this.chapterInfo = Object.assign({}, this.chapterInfo, val)
        this.handleTitle()
      },
      deep: true
    }
  },

  methods: {
    handleTitle () {
      let title = 'Ray'
      if (this.chapterInfo.title) {
        title = `${this.chapterInfo.author} - ${this.chapterInfo.title}`
        document.querySelector('#title-marquee').innerHTML = `<marquee direction="left" behavior="alternate" scrollamount="1" onmouseover="this.stop()" onmouseout="this.start()" style="padding: 0 4px;">${title}</marquee>`
      } else {
        document.querySelector('#title-marquee').innerHTML = `<div>Ray</div>`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.bed-title-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 22px;
  background: #fff;
  text-align: center;
  -webkit-app-region: drag;
  user-select: none;
  z-index: 9999;
  .box-title {
    display: inline-flex;
    align-items: center;
    max-width: 600px;
    height: 22px;
    padding: 0 6px;
    // background: red;
    img {
      margin-right: 4px;
      max-width: 16px;
      max-height: 16px;
    }
    .title {
      height: 22px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>
