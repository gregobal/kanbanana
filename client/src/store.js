import Vue from 'vue'
import Vuex from 'vuex'
// import { apolloClient } from './vue-apollo'
// import gql from 'graphql-tag'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { },
  state: {
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: { }
})
