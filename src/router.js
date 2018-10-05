import Vue    from 'vue'
import Router from 'vue-router'
import Home   from './views/Home.vue'
import Debug  from './views/debug.vue'
import About  from './views/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/debug',
      name: 'debug',
      component: Debug
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    // {
    //   path: '/debug',
    //   name: 'debug',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "debug" */ './views/debug.vue')
    // },
  ]
})
