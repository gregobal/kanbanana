<template>
    <v-app-bar color="green lighten-4" class="mb-3">
        <v-toolbar-title class="headline">
            <span @click="$route.path !== '/' && $router.push('/')"
                  class="font-weight-black" style="cursor: pointer">
                <span class="green--text text--darken-1">Kan</span>
                <span class="yellow--text text--accent-1">Banana</span>
            </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <span v-if="user" class="mx-3">{{ user.name || user.email }}</span>
        <div class="text-center">
            <v-menu offset-y v-if="user">
                <template v-slot:activator="{ on }">
                    <v-btn color="success"
                           icon
                           v-on="on"
                    >
                        <v-icon>view_headline</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="$route.name !== 'projects'"
                                 @click="$router.push('/projects')">
                        <v-list-item-title>Projects</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="onLogout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn v-else
                   icon
                   @click="$router.push('/login')"
            >
                <v-icon>input</v-icon>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
  import {onLogout} from "../vue-apollo";

  export default {
    name: "Header",
    computed: {
      user: function () {
        return this.$store.state.user
      }
    },
    methods: {
      async onLogout () {
        this.$store.commit('setLoading', true);
        this.$router.push('/');
        this.$store.commit('setUser', null);
        await onLogout (this.$apollo.provider.defaultClient);
        this.$store.commit('setLoading', false);
      }
    }
  }
</script>

<style scoped>

</style>
