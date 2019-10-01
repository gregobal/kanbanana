<template>
    <v-snackbar :timeout="10000"
                :multi-line="true"
                color="error"
                v-model="snackbar">
        {{ errorMessage }}
        <v-btn text
               @click="snackbar = false">
            Close
        </v-btn>
    </v-snackbar>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "ErrorHandler",
    data() {
      return {
        snackbar: false,
        errorMessage: null
      }
    },
    apollo: {
      error: gql`query {
          error @client
      }`,
    },
    watch: {
      error: async function () {
        if (this.error) {
          this.errorMessage = this.error;
          this.snackbar = true;
          if (this.error === 'GraphQL error: You must be logged in.') {
            await this.$apollo.mutate({
              mutation: gql`mutation ($value: Boolean!) {
                setIsAuth (value: $value) @client
              }`,
              variables: {
                value: false,
              }
            });
            this.$route.name !== 'login' && this.$router.push('login')
          }
        }
      },
      snackbar: function (newSnackbar) {
        if (!newSnackbar) {
          this.errorMessage = null;
          this.$apollo.mutate({
            mutation: gql`mutation ($value: Boolean!) {
                setError (value: $value) @client
            }`,
            variables: {
              value: this.errorMessage,
            },
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
