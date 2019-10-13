import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

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
      component: Register,
      beforeEnter: function (to, from, next) {
        if (store.state.user) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
      beforeEnter: authGuard
    },
    {
      path: '/board/:boardId',
      name: 'board',
      component: Board,
      props: true,
      beforeEnter: authGuard
    }
  ]
})

function authGuard (to, from, next) {
  if (store.state.user) {
    next()
  } else {
    next('/login')
  }
}
