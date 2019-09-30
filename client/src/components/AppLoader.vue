<template>
    <div class="text-center" v-if="loading">
        <v-overlay>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "Loader",
    apollo: {
      loading: gql`query {
          loading @client
      }`,
    }
  }
</script>

<style scoped>

</style>
