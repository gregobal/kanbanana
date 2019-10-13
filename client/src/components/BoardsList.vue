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
            <v-text-field v-model.trim="title"
                          required
                          hide-details
                          class="my-0 py-0"
                          label="Title"
                          single-line
                          clearable
                          :loading="loading"
                          :append-icon="title ? 'save' : ''"
                          append-outer-icon="cancel"
                          @click:append="onSave"
                          @click:append-outer="onCancel"
            ></v-text-field>
        </v-list-item>
        <template v-for="(board, i) in boards">
            <v-divider :key="i"></v-divider>
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
  import {GET_BOARDS} from "../graphql/queries";
  import {CREATE_BOARD} from "../graphql/mutations";
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
        query: GET_BOARDS,
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
        if (this.title) {
          this.loading = true;
          try {
            const {data} = await this.$apollo.mutate({
              mutation: CREATE_BOARD,
              variables: {
                projectId: this.projectId,
                title: this.title
              }
            });
            const {createBoard} = data;
            this.boards.push(createBoard);
            this.isAdd = false;
            this.title = null
          } catch (error) {
            this.$store.commit('setError', error);
            console.error(error)
          }
          this.loading = false;
        }
      },
      onCancel () {
        this.title = null;
        this.isAdd = false;
      }
    }
  }
</script>

<style scoped>

</style>
