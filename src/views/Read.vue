<template>
  <div class="page-view">
    <div class="window">
      <iframe v-if="url" :src="url" frameborder="0"></iframe>
    </div>

    <div class="btn-back" @click="back()">
      <img src="../assets/arrow_left.png" alt="<">
      back
    </div>
  </div>
</template>

<script>
export default {
  name: 'pageView',
  data () {
    return {
      url: ''
    }
  },

  mounted () {
    const query = this.$route.query

    if (!query.url) {
      this.$router.go(-1)
      return
    }
    this.url = decodeURIComponent(query.url)
  },

  methods: {
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
}
</style>
