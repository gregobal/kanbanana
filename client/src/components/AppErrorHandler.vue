<template>
    <v-snackbar :timeout="4000"
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
  export default {
    name: "AppErrorHandler",
    props: {
      error: Error || Object
    },
    data() {
      return {
        snackbar: false,
        errorMessage: null
      }
    },
    watch: {
      snackbar: function (newSnackbar) {
        if (!newSnackbar) {
          this.errorMessage = null;
          this.$store.commit('setError', null);
        }
      },
    },
    mounted() {
      if (this.error) {
        this.errorMessage = this.error.message;
        this.snackbar = true;
        if (this.error.message === 'GraphQL error: You must be logged in.') {
          this.$store.commit('setUser', null);
          this.$route.name !== 'login' && this.$router.push('login')
        }
      }
    }
  }
</script>

<style scoped>

</style>
