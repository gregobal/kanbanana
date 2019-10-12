<template>
    <v-card class="ma-1 red lighten-3">
        <v-card-title class="pa-2 task-handle" style="cursor: move" v-if="!isUpdate && !loading">
            <v-icon @click="isUpdate=true"
                    small>
                edit
            </v-icon>
            <div class="flex-grow-1" style="cursor: move"></div>
            <v-icon @click="onDelete"
                    class="ml-1"
                    color="red"
                    small>
                delete
            </v-icon>
        </v-card-title>
        <v-card-title class="pa-2" v-if="!isUpdate && loading">
            <v-icon small>update</v-icon>
            <div class="flex-grow-1" style="cursor: move"></div>
        </v-card-title>
        <v-card-text class="py-1">
            <v-textarea
                    v-if="isUpdate"
                    v-model.trim="title"
                    class="mb-0 py-0"
                    auto-grow
                    rows="2"
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
                   :loading="loading"
                   text small>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
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
        this.loading = true;
        if (this.task && this.task._id) {
          await this.$store.dispatch('updateBoardTask', {taskId: this.task._id, title: this.title})
        } else if (this.columnId) {
          await this.$store.dispatch('createBoardTask', {columnId: this.columnId, title: this.title});
          this.$emit('add');
        }
        this.loading = false;
        this.isUpdate=false;
      },
      async onDelete () {
        this.loading = true;
        await this.$store.dispatch('deleteBoardTask', {columnId: this.columnId, taskId: this.task._id});
        this.loading = false;
      },
      onCancel () {
        this.title = this.task ? this.task.title : null;
        this.isUpdate=false;
      }
    }
  }
</script>

<style scoped>

</style>
