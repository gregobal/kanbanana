<template>
  <v-app>
    <v-content class="fill-height yellow lighten-5">
      <app-header></app-header>
      <router-view></router-view>
    </v-content>
    <app-loader v-if="loading"></app-loader>
    <app-error-handler v-if="error"
                       :error="error">
    </app-error-handler>
  </v-app>
</template>

<script>
  import gql from 'graphql-tag'
  import AppLoader from './components/AppLoader'
  import AppHeader from './components/AppHeader'
  import AppErrorHandler from './components/AppErrorHandler'

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
      query: gql`query {
        user {
          email,
          name
        }
      }`,
      result({data}) {
        const {user} = data;
        if (user) {
          this.$store.commit('setUser', data.user)
        }
      }
    }
  }
};
</script>
