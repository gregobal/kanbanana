<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">
        <span>Kanbanana</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content class="fill-height">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  data: () => ({
    //
  }),
  beforeCreate() {
    this.$router.push('/login')
  }
};
</script>
