<template>
    <div>
        <v-card flat>
            <v-text-field
                    class="mx-5 mt-0 mb-2"
                    v-model.trim="title"
                    label="Title"
                    single-line
                    clearable
                    hide-details
            ></v-text-field>
            <v-card-actions>
                <v-btn @click="onSave"
                       :loading="loading"
                       text small>
                    Save
                </v-btn>
                <v-btn @click="$emit('update')"
                       text small>
                    Cancel
                </v-btn>
                <div class="flex-grow-1"></div>
                <v-btn @click="onDelete"
                       color="red"
                       :loading="loading"
                       text small>
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "BoardColumnUpdate",
    props: {
      column: Object,
      boardId: String
    },
    data () {
      return {
        loading: false,
        title: this.column ? this.column.title : null
      }
    },
    methods: {
      async onSave() {
        try {
          let result;
          if (this.column && this.column._id) {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($columnId: ID! $title: String!) {
                updateBoardColumn(
                    columnId: $columnId
                    title: $title
                ) {
                    _id
                    title
                  }
                }`,
              variables: {
                columnId: this.column._id,
                title: this.title
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            });
          } else if (this.boardId) {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($boardId: ID! $title: String!) {
                createBoardColumn(
                    boardId: $boardId
                    title: $title
                ) {
                    _id
                    title
                  }
                }`,
              variables: {
                boardId: this.boardId,
                title: this.title
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            });
          }
          const {data} = result;
          this.$emit('update', data);
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
      },
      async onDelete () {
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($columnId: ID! $boardId: ID!) {
              deleteBoardColumn(
                  columnId: $columnId
                  boardId: $boardId
              ) {
                  _id
                }
            }`,
            variables: {
              columnId: this.column._id,
              boardId: this.boardId
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          this.$emit('update', data);
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
