import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Feeds from './views/Feeds.vue'
import Read from './views/Read.vue'
import FeedsManage from './views/FeedsManage.vue'
import BookmarkChapters from './views/BookmarkChapters.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      meta: {
        index: 0 // 页面层级
      },
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        index: 1 // 页面层级
      },
      component: Home
    },
    {
      path: '/feeds',
      name: 'feeds',
      meta: {
        index: 2 // 页面层级
      },
      component: Feeds
    },
    {
      path: '/read',
      name: 'read',
      meta: {
        index: 3 // 页面层级
      },
      component: Read
    },
    {
      path: '/feedsManage',
      name: 'feedsManage',
      meta: {
        index: 3 // 页面层级
      },
      component: FeedsManage
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      meta: {
        index: 2 // 页面层级
      },
      component: BookmarkChapters
    },
    {
      path: '/config',
      name: 'config',
      meta: {
        index: 2 // 页面层级
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "config" */ './views/Config.vue')
    }
  ]
})
