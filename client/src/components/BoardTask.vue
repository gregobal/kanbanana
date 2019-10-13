<template>
    <v-card class="ma-1"
            :color="color"
            min-height="90">
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
                {{ title }}
            </p>
        </v-card-text>
        <v-card-actions class="py-0" v-if="isUpdate">
            <v-btn @click="onSave"
                   :disabled="!title"
                   :loading="loading"
                   text small>
                Save
            </v-btn>
            <v-btn @click="onCancel"
                   :loading="loading"
                   text small>
                Cancel
            </v-btn>
            <div class="flex-grow-1" style="cursor: move"></div>
            <v-menu bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text small
                           v-on="on">
                        Color
                    </v-btn>
                </template>
                <v-list dense width="60">
                    <v-list-item v-for="(clr, i) in colors"
                                 :key="i"
                                 @click="color = clr"
                    >
                        <v-chip class="mx-auto" small :color="clr"></v-chip>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-actions>
    </v-card>
</template>

<script>
  const DEFAULT_COLOR = '#FAFAFA';
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
        color: this.task ? this.task.color : DEFAULT_COLOR,
        isUpdate: !this.task,
        colors: [DEFAULT_COLOR, '#C5E1A5', '#FFF59D', '#EF9A9A', '#CE93D8']
      }
    },
    methods: {
      async onSave () {
        if (this.title) {
          this.loading = true;
          if (this.task && this.task._id) {
            await this.$store.dispatch('updateBoardTask', {taskId: this.task._id, title: this.title, color: this.color})
          } else if (this.columnId) {
            await this.$store.dispatch('createBoardTask', {
              columnId: this.columnId,
              title: this.title,
              color: this.color
            });
            this.$emit('add');
          }
          this.loading = false;
          this.isUpdate = false;
        }
      },
      async onDelete () {
        this.loading = true;
        await this.$store.dispatch('deleteBoardTask', {columnId: this.columnId, taskId: this.task._id});
        this.loading = false;
      },
      onCancel () {
        this.title = this.task ? this.task.title : null;
        this.color = this.task ? this.task.color : DEFAULT_COLOR;
        this.isUpdate=false;
        if (this.columnId) {
          this.$emit('add');
        }
      }
    }
  }
</script>

<style scoped>

</style>
