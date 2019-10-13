<template>
  <v-app>
    <app-header></app-header>
    <v-content class="fill-height yellow lighten-5 mt-3">
      <router-view></router-view>
    </v-content>
    <app-loader v-if="loading"></app-loader>
    <app-error-handler v-if="error"
                       :error="error">
    </app-error-handler>
  </v-app>
</template>

<script>
  import AppLoader from './components/AppLoader'
  import AppHeader from './components/AppHeader'
  import AppErrorHandler from './components/AppErrorHandler'
  import {GET_USER} from "./graphql/queries";

export default {
  name: 'App',
  components: {
    AppErrorHandler,
    AppHeader,
    AppLoader
  },
  computed: {
    loading: function () {
      return this.$store.state.loading
    },
    error: function () {
      return this.$store.state.error
    },
  },
  apollo: {
    user: {
      query: GET_USER,
      result({data}) {
        this.$store.commit('setUser', data.user)
      },
      watchLoading (isLoading) {
        this.$store.commit('setLoading', isLoading)
      },
    }
  }
};
</script>
