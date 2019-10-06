<template>
    <v-col cols="2">
        <v-card class="pb-1">
            <board-column-update v-if="isUpdate"
                                 :column="column"
                                 :board-id="boardId"
                                 @update="onUpdate">
            </board-column-update>
            <v-card-title class="column-handle" style="cursor: move" v-else>
                <v-col class="text-truncate pa-0" cols="10">{{column.title}}</v-col>
                <v-col class="pa-0 text-end" cols="2">
                    <v-btn @click="isUpdate = true"
                           fab x-small outlined>
                        <v-icon small>edit</v-icon>
                    </v-btn>
                </v-col>
            </v-card-title>
            <v-sheet class="mx-1 body-2 yellow lighten-5">
                <draggable v-model="tasks"
                           group="task"
                           handle=".task-handle"
                           @start="onTaskDragStart"
                           @end="onTaskDragEnd"
                           @add="onTaskDragAdd"
                >
                    <board-task v-for="task in tasks" :key="task._id"
                                :task="task"
                                :column-id="column._id"
                                @update="onTaskUpdate">
                    </board-task>
                </draggable>
                <board-task v-if="isAddTask"
                            :column-id="column._id"
                            @update="onTaskUpdate">
                </board-task>
                <div class="text-center">
                    <v-btn @click="isAddTask=true"
                           class="ma-1"
                           color="success"
                           small text>
                        <v-icon>add</v-icon>
                    </v-btn>
                </div>
            </v-sheet>
        </v-card>
    </v-col>
</template>

<script>
  import gql from 'graphql-tag'
  import Draggable from 'vuedraggable'
  import BoardTask from '../BoardTask';
  import BoardColumnUpdate from "./BoardColumnUpdate";
  export default {
    name: "BoardColumn",
    components: {
      BoardColumnUpdate,
      BoardTask,
      Draggable
    },
    props: {
      column: Object,
      boardId: String
    },
    data () {
      return {
        isAddTask: false,
        isUpdate: false,
        title: null,
        tasks: this.column && this.column.tasks ? this.column.tasks : [],
        tasksOrderBeforeDrag: []
      }
    },
    watch: {
      column: function () {
        this.tasks = this.column && this.column.tasks ? this.column.tasks : []
      }
    },
    methods: {
      onTaskUpdate (data) {
        if (data) {
          this.$emit('task-update', data)
        }
        this.isAddTask = false
      },
      onUpdate (data) {
        this.isUpdate=false;
        this.$emit('update', data)
      },
      onTaskDragStart () {
        this.tasksOrderBeforeDrag = this.tasks.map(({_id}) => _id)
      },
      async onTaskDragEnd () {
        await this.onTaskDragUpdate('end')
      },
      async onTaskDragAdd () {
        await this.onTaskDragUpdate('add')
      },
      async onTaskDragUpdate (act) {
        const taskIds = this.tasks.map(({_id}) => _id);
        if (taskIds.length && taskIds.length === this.tasksOrderBeforeDrag.length) {
          let condition = true;
          for (let i = 0; i < taskIds.length; i++) {
            if (taskIds[i] !== this.tasksOrderBeforeDrag[i]) {
              condition = false;
              break
            }
          }
          if (condition) return;
        }
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($columnId: ID! $taskIds: [ID]!) {
                dragTaskInColumn(
                    columnId: $columnId
                    taskIds: $taskIds
                ) {
                  _id
                  title
                  tasks {
                      _id
                      title
                      }
                  }
                }`,
            variables: {
              columnId: this.column._id,
              taskIds: taskIds
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          this.$emit('task-drag', data, act);
          this.tasksOrderBeforeDrag = []
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
