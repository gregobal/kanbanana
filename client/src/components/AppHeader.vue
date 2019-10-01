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
  import gql from 'graphql-tag'
  export default {
    name: "Header",
    watch: {
      user: async function (newUser) {
        await this.$apollo.mutate({
          mutation: gql`mutation ($value: Boolean!) {
                  setIsAuth (value: $value) @client
              }`,
          variables: {
            value: !!newUser,
          }
        });
      }
    },
    apollo: {
      user: gql`query {
        user {
            email,
            name
        }
      }`
    }
  }
</script>

<style scoped>

</style>
