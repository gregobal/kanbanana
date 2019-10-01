<template>
    <v-list class="py-0">
        <v-subheader>
            <v-btn @click="isAdd = true"
                   class="my-3"
                   color="success"
                   fab x-small outlined
                   :loading="loading">
                <v-icon>add</v-icon>
            </v-btn>
        </v-subheader>
        <v-list-item v-if="isAdd">
            <v-text-field
                    v-model.trim="title"
                    class="my-0 py-0"
                    label="Title"
                    single-line
                    clearable
                    append-icon="save"
                    append-outer-icon="cancel"
                    @click:append="onSave"
                    @click:append-outer="isAdd = false"
            ></v-text-field>
        </v-list-item>
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
        loading: false,
        isAdd: false,
        title: null
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
    },
    methods: {
      async onSave() {
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($projectId: ID! $title: String!) {
                createBoard(
                    projectId: $projectId
                    title: $title
                ) {
                    _id
                    title
                  }
                }`,
            variables: {
              projectId: this.projectId,
              title: this.title
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          const {createBoard} = data;
          this.boards.push(createBoard);
          this.isAdd = false;
        } catch (e) {
          this.$apollo.mutate({
            mutation: gql`mutation ($value: Boolean!) {
                setError (value: $value) @client
            }`,
            variables: {
              value: e.message,
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
