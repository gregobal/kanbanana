<template>
    <div>
        <v-card flat>
            <v-text-field
                    class="mx-5 mt-0 mb-2"
                    v-model.trim="title"
                    required
                    label="Title"
                    single-line
                    clearable
                    hide-details
            ></v-text-field>
            <v-card-actions>
                <v-btn @click="onSave"
                       :loading="loading"
                       :disabled="!title"
                       text small>
                    Save
                </v-btn>
                <div class="flex-grow-1"></div>
                <v-btn @click="$emit('update')"
                       :loading="loading"
                       text small>
                    Cancel
                </v-btn>
                <div class="flex-grow-1"></div>
                <div class="flex-grow-1"></div>
                <div class="flex-grow-1"></div>
                <v-btn v-if="column"
                       @click="onDelete"
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
        if (this.title) {
          this.loading = true;
          if (this.column && this.column._id) {
            await this.$store.dispatch('updateBoardColumn', {columnId: this.column._id, title: this.title})
          } else if (this.boardId) {
            await this.$store.dispatch('createBoardColumn', {boardId: this.boardId, title: this.title})
          }
          this.loading = false;
          this.$emit('update');
        }
      },
      async onDelete () {
        this.loading = true;
        await this.$store.dispatch('deleteBoardColumn', {columnId: this.column._id, boardId: this.boardId});
        this.loading = false;
        this.$emit('update');
      }
    }
  }
</script>

<style scoped>

</style>
