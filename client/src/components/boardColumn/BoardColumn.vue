<template>
    <v-col cols="2">
        <v-card class="pb-1">
            <board-column-update v-if="isUpdate"
                                 :column="column"
                                 :board-id="boardId"
                                 @update="isUpdate=false">
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
            <v-sheet class="mx-1 pt-1 body-2 yellow lighten-5">
                <draggable v-model="tasks"
                           group="task"
                           handle=".task-handle"
                           @end="onTaskDrag"
                           @add="onTaskDrag"
                >
                    <board-task v-for="task in tasks" :key="task._id"
                                :task="task"
                                :column-id="column._id">
                    </board-task>
                </draggable>
                <board-task v-if="isAddTask"
                            :column-id="column._id"
                            @add="isAddTask = false">
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
      async onTaskDrag () {
        const taskIds = this.tasks.map(({_id}) => _id);
        await this.$store.dispatch('dragTaskInColumns', {columnId: this.column._id, taskIds: taskIds})
      }
    }
  }
</script>

<style scoped>

</style>
