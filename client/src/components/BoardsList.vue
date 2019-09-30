<template>
    <v-list class="py-0">
        <v-subheader>
            <v-btn class="my-3"
                   color="success"
                   fab x-small outlined
                   :loading="loading">
                <v-icon>add</v-icon>
            </v-btn>
        </v-subheader>
        <template v-for="board in boards">
            <v-divider :key="board._id"></v-divider>
            <v-list-item :key="board._id" :to="`/board/${board._id}`">
                <v-list-item-content>
                    <v-list-item-title>
                        {{board.title}}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
    </v-list>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "BoardsList",
    props: {
      projectId: String
    },
    data () {
      return {
        boards: [],
        loading: false
      }
    },
    apollo: {
      boards: {
        query: gql`query ($projectId: ID!) {
          boards (projectId: $projectId) {
            _id
            title
          }
        }`,
        variables () {
          return {
            projectId: this.projectId
          }
        },
        watchLoading (isLoading) {
          this.loading = isLoading
        }
      }
    }
  }
</script>

<style scoped>

</style>
