<template>
  <div class="page-home">
    <navigation></navigation>

    <div class="preview">
      awef
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'home',
  components: {
    Navigation
  }
}
</script>

<style lang="scss" scoped>
.page-home {
  position: relative;
  height: 100%;
  .preview {
    margin-left: 300px;
    height: 100%;
    // background: blue;
  }
}
</style>
