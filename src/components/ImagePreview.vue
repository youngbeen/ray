<template>
  <section class="window-image-preview" v-show="isShow">
    <div class="bg" @click="close()"></div>
    <div class="box-container">
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
    },
    close () {
      this.isShow = false
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
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .5);
  }
  .box-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 60px 100px;
    padding: 20px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 0 28px 1px rgba(122, 122, 122, .6);
    overflow: hidden;
    img {
      max-width: calc(100% - 240px);
      max-height: calc(100% - 160px);
    }
  }
}
</style>
