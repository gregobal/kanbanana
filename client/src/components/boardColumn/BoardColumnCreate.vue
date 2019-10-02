<template>
    <v-col cols="2">
        <v-card flat min-heigth="300">
            <v-text-field
                    class="mx-5"
                    v-model.trim="title"
                    label="Title"
                    single-line
                    clearable
            ></v-text-field>
        </v-card>
        <v-card-actions>
            <v-btn @click="onSave"
                   :loading="loading"
                   text>
                Save
            </v-btn>
            <v-btn @click="$emit('create-close')"
                   text>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-col>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "BoardColumnCreate",
    props: {
      boardId: String
    },
    data () {
      return {
        loading: false,
        title: null
      }
    },
    methods: {
      async onSave() {
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($boardId: ID! $title: String!) {
                createBoardColumn(
                    boardId: $boardId
                    title: $title
                ) {
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
          this.$emit('create-close', data);
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
