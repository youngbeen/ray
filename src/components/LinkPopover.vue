<template>
  <section class="comp-link-pop" v-show="isShow">
    {{ link }}
  </section>
</template>

<script>
import eventBus from '@/eventBus'

export default {
  data () {
    return {
      isShow: false,
      link: ''
      // left: 0,
      // top: 0
    }
  },

  mounted () {
    eventBus.$on('hoverLink', (params) => {
      if (!params || !params.link) {
        return
      }
      this.link = params.link
      // this.left = params.left
      // this.top = params.top
      this.isShow = true
    })
    eventBus.$on('outLink', () => {
      // console.log('out')
      this.link = ''
      this.isShow = false
    })
  }
}
</script>

<style scoped lang="scss">
.comp-link-pop {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 3;
  padding: 0 6px;
  border-top-right-radius: 6px;
  background: rgb(99, 99, 99);
  color: rgb(233, 233, 233);
  font-size: 11px;
}
</style>
