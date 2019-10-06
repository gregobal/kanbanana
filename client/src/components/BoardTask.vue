<template>
    <v-card class="ma-1 red lighten-3">
        <v-card-title class="pa-2 task-handle" style="cursor: move" v-if="!isUpdate">
            <v-icon @click="isUpdate=true"
                    small>
                edit
            </v-icon>
            <div class="flex-grow-1" style="cursor: move"></div>
            <v-icon v-if="!loading"
                    @click="onDelete"
                    class="ml-1"
                    color="red"
                    small>
                delete
            </v-icon>
        </v-card-title>
        <v-card-text class="py-1">
            <v-textarea
                    v-if="isUpdate"
                    v-model.trim="title"
                    class="mb-0 py-0"
                    auto-grow
                    rows="3"
                    clearable
                    hide-details
            ></v-textarea>
            <p v-else
               class="body-1 font-weight-medium">
                {{ task && task.title }}
            </p>
        </v-card-text>
        <v-card-actions class="py-0" v-if="isUpdate">
            <v-btn @click="onSave"
                   :loading="loading"
                   text small>
                Save
            </v-btn>
            <v-btn @click="onCancel"
                   text small>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "BoardTask",
    props: {
      columnId: String,
      task: Object,
    },
    data () {
      return {
        loading: false,
        title: this.task ? this.task.title : null,
        isUpdate: !this.task
      }
    },
    methods: {
      async onSave () {
        let result;
        try {
          if (this.task && this.task._id) {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($taskId: ID! $title: String!) {
              updateBoardTask(
                  taskId: $taskId
                  title: $title
              ) {
                  _id
                  title
                  column {
                    _id
                  }
                }
            }`,
              variables: {
                taskId: this.task._id,
                title: this.title
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            });
          } else {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($columnId: ID! $title: String!) {
              createBoardTask(
                  columnId: $columnId
                  title: $title
              ) {
                  _id
                  title
                  column {
                    _id
                  }
                }
            }`,
              variables: {
                columnId: this.columnId,
                title: this.title
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            });
          }
          const {data} = result;
          this.$emit('update', data);
          this.isUpdate=false;
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
              mutation: gql`mutation ($columnId: ID! $taskId: ID!) {
              deleteBoardTask(
                  columnId: $columnId
                  taskId: $taskId
              ) {
                  _id
                  column {
                    _id
                  }
                }
            }`,
              variables: {
                columnId: this.columnId,
                taskId: this.task._id
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

      },
      onCancel () {
        this.title = this.task ? this.task.title : null;
        this.$emit('update');
        this.isUpdate=false;
      }
    }
  }
</script>

<style scoped>

</style>
