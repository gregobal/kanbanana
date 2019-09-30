<template>
  <v-app>
    <v-content class="fill-height yellow lighten-5">
      <app-header></app-header>
      <router-view></router-view>
    </v-content>
    <app-loader></app-loader>
    <error-handler></error-handler>
  </v-app>
</template>

<script>
  import AppLoader from './components/AppLoader'
  import AppHeader from './components/AppHeader'
  import ErrorHandler from './components/ErrorHandler'

export default {
  name: 'App',
  components: {
    ErrorHandler,
    AppHeader,
    AppLoader
  }
};
</script>
