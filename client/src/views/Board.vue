<template>
    <v-container v-if="board">
        <v-toolbar>
            <v-toolbar-title>
                Board: {{board.title}} | {{board.descr}}
            </v-toolbar-title>
        </v-toolbar>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "Board",
    props: {
      boardId: String
    },
    apollo: {
      board: {
        query: gql`query ($boardId: ID!) {
          board (boardId: $boardId) {
            _id
            title
            descr
          }
        }`,
        variables () {
          return {
            boardId: this.boardId
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
