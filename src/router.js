import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Feeds from './views/Feeds.vue'
// import Read from './views/Read.vue'
import FeedsManage from './views/FeedsManage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/feeds',
      name: 'feeds',
      component: Feeds
    },
    // {
    //   path: '/read',
    //   name: 'read',
    //   component: Read
    // },
    {
      path: '/feedsManage',
      name: 'feedsManage',
      component: FeedsManage
    },
    {
      path: '/config',
      name: 'config',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "config" */ './views/Config.vue')
    }
  ]
})
