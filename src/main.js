import Vue from 'vue'
import App from './App.vue'
import router from './router'
import system from './models/system'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleLeft,
  faEye,
  faShare,
  faStar,
  faCode
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEye)
library.add(faShare)
library.add(faStar)
library.add(faAngleLeft)
library.add(faCode)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
