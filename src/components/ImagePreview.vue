<template>
  <section class="window-image-preview" v-show="isShow">
    <div class="bg" @click="close()"></div>
    <div class="box-container" :class="[animateKey && 'animated']">
      <img :src="url" alt="">
    </div>
  </section>
</template>

<script>
import eventBus from '@/eventBus'

export default {
  name: 'imagePreview',
  data () {
    return {
      isShow: false,
      animateKey: false,
      url: ''
    }
  },

  mounted () {
    eventBus.$on('preview', params => {
      if (params && params.image) {
        this.url = params.image
        this.show()
      }
    })
  },

  beforeDestroy () {
    eventBus.$off('preview')
  },

  methods: {
    show () {
      this.isShow = true
      setTimeout(() => {
        this.animate(true)
      }, 100)
    },
    close () {
      this.isShow = false
      this.animate(false)
    },
    animate (val) {
      this.animateKey = val
    }
  }
}
</script>

<style scoped lang="scss">
.window-image-preview {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  text-align: center;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .5);
  }
  .box-container {
    display: inline-block;
    position: relative;
    margin-top: 30px;
    max-height: 580px;
    padding: 20px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 0 28px 1px rgba(122, 122, 122, .6);
    opacity: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    transition: all 0.4s;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: rgba(#ccc, .8);
    }
    img {
      max-width: 1000px;
    }
    &.animated {
      margin-top: 50px;
      opacity: 1;
    }
  }
}
</style>
