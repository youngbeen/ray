<template>
  <div id="app">
    <div class="title-bar">Ray</div>

    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}
// body {
//   -webkit-app-region: drag;
// }
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
}
.title-bar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 22px;
  line-height: 22px;
  // background: red;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  -webkit-app-region: drag;
  z-index: 9999;
}
.container {
  height: calc(100% - 22px);
  padding-top: 22px;
}
</style>
