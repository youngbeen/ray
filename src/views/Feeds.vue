<template>
  <div class="page-feeds">
    <navigation></navigation>
    <chapter-view></chapter-view>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import ChapterView from '@/components/ChapterView.vue'

export default {
  name: 'feeds',
  components: {
    Navigation,
    ChapterView
  }
}
</script>

<style lang="scss" scoped>
.page-feeds {
  position: relative;
  height: 100%;
}
</style>
