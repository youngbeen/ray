<template>
  <section class="window-loading" v-show="system.loading">
    <div class="bg"></div>
    <div class="box-container">
      <div class="character">P</div>
      <div class="line">&nbsp;</div>
    </div>
  </section>
</template>

<script>
import system from '@/models/system'

export default {
  name: 'loading',
  data () {
    return {
      system
    }
  }
}
</script>

<style scoped lang="scss">
.window-loading {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .5);
  }
  .box-container {
    position: relative;
    margin: 20% auto 0;
    width: 400px;
    height: 60px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 0 28px 1px rgba(122, 122, 122, .6);
    overflow: hidden;
    .character {
      position: absolute;
      left: 16px;
      top: 16px;
      font-size: 20px;
      font-weight: 500;
    }
    .line {
      position: absolute;
      width: 0;
      animation: ray 2s ease-in infinite;
      // left: 20px;
      // top: 28px;
      // height: 2px;
      // border-left: 0px solid rgba(0,0,0,0);
      // border-top: 0px solid rgba(0,0,0,0);
      // border-right: 14px solid #cccf23;
      // border-bottom: 0px solid rgba(0,0,0,0);
      // transform: rotate(1deg);
    }
  }
}
@keyframes ray {
    0% {
      left: 18px;
      top: 31px;
      height: 2px;
      border-left: 0px solid rgba(0,0,0,0);
      border-top: 0px solid rgba(0,0,0,0);
      border-right: 14px solid #cccf23;
      border-bottom: 0px solid rgba(0,0,0,0);
      transform: rotate(60deg);
    }
    40% {
      left: 20px;
      top: 28px;
      height: 2px;
      border-left: 0px solid rgba(0,0,0,0);
      border-top: 0px solid rgba(0,0,0,0);
      border-right: 14px solid #cccf23;
      border-bottom: 0px solid rgba(0,0,0,0);
      transform: rotate(1deg);
    }
    100% {
      left: 20px;
      top: 28px;
      height: 4px;
      border-left: 0px solid rgba(0,0,0,0);
      border-top: 1px solid rgba(0,0,0,0);
      border-right: 400px solid #cccf23;
      border-bottom: 30px solid rgba(0,0,0,0);
      transform: rotate(1deg);
    }
  }
</style>
