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
        <span v-if="user">{{ user.name || user.email }}</span>
    </v-app-bar>
</template>

<script>
  export default {
    name: "Header",
    computed: {
      user: function () {
        return this.$store.state.user
      }
    }
  }
</script>

<style scoped>

</style>
