import Vue from 'vue'
import App from './App.vue'
import router from './router'
import system from './models/system'

Vue.config.productionTip = false

router.afterEach((to, from) => {
  if (to.name !== 'read') {
    // 回到非阅读页，清除阅读文章的信息
    system.readingChapter = {
      icon: '',
      author: '',
      title: ''
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
