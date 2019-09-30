import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home'
import Login from './views/Login'
import Board from './views/Board'
import Projects from './views/Projects'
import Register from './views/Register'


Vue.use(Router);

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
      path: '/login',
      name: 'login',
      component: Login,
      props: true
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: Board,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
