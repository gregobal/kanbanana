<template>
    <v-container v-if="board">
        <v-card>
            <v-toolbar dense flat>
                <v-toolbar-title>
                    <v-text-field
                            v-if="isToolbarEdit"
                            v-model.trim="title"
                            label="Title"
                            single-line
                            clearable
                    ></v-text-field>
                    <span v-else>Board: <span class="font-weight-bold">{{board.title}}</span></span>
                </v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-toolbar-title>
                    <span v-if="isToolbarEdit">
                        <v-btn class="mr-1"
                               fab x-small outlined
                               :loading="loading"
                               @click="onSave">
                            <v-icon small>save</v-icon>
                        </v-btn>
                        <v-btn fab x-small outlined
                               :loading="loading"
                               @click="isToolbarEdit = false">
                            <v-icon small>cancel</v-icon>
                        </v-btn>
                    </span>
                    <v-btn v-else
                           fab x-small outlined
                           @click="isToolbarEdit = true">
                        <v-icon small>edit</v-icon>
                    </v-btn>
                </v-toolbar-title>
            </v-toolbar>
            <v-toolbar dense flat>
                <v-toolbar-title class="body-2">
                    <v-text-field
                            v-if="isToolbarEdit"
                            v-model.trim="descr"
                            label="Description"
                            single-line
                            clearable
                    ></v-text-field>
                    <span v-else ><span class="font-weight-medium">Description: </span>{{board.descr}}</span>
                </v-toolbar-title>
            </v-toolbar>
            <draggable v-model="boardColumns"
                       handle=".column-handle"
                       @start="onColumnDragStart"
                       @end="onColumnDragEnd"
                       class="ma-3 green lighten-5 d-flex justify-center align-start">
                <board-column v-for="boardColumn in boardColumns" :key="boardColumn._id"
                              :column="boardColumn"
                              :board-id="board._id || boardId"
                              @update="onColumnUpdate"
                              @task-update="onTaskInColumnUpdate"
                              @task-drag="onTaskDrag">
                </board-column>
                <v-col cols="2" v-if="isColumnAdd">
                    <board-column-update :board-id="board._id || boardId"
                                         @update="onColumnUpdate">
                    </board-column-update>
                </v-col>
                <v-btn v-if="!isColumnAdd && boardColumns.length < 6"
                       class="my-3 ml-2"
                       color="success"
                       fab large outlined
                       :loading="loading"
                       @click="isColumnAdd = true">
                    <v-icon large>add</v-icon>
                </v-btn>
            </draggable>
        </v-card>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  import Draggable from 'vuedraggable'
  import BoardColumn from "../components/boardColumn/BoardColumn";
  import BoardColumnUpdate from "../components/boardColumn/BoardColumnUpdate";
  export default {
    name: "Board",
    components: {
      BoardColumnUpdate,
      BoardColumn,
      Draggable
    },
    props: {
      boardId: String
    },
    data () {
      return {
        loading: false,
        isToolbarEdit: false,
        isColumnAdd: false,
        title: null,
        descr: null,
        boardColumns: [],
        columnsOrderBeforeDrag: []
      }
    },
    apollo: {
      board: {
        query: gql`query ($boardId: ID!) {
          board (boardId: $boardId) {
            _id
            title
            descr
            columns {
                _id
                title
                tasks {
                    _id
                    title
                }
            }
          }
        }`,
        variables () {
          return {
            boardId: this.boardId
          }
        },
        result ({ data }) {
          const {board} = data;
          if (board) {
            this.title = board.title;
            this.descr = board.descr;
            if (board.columns) {
              this.boardColumns = board.columns;
            }
          }
        }
      }
    },
    methods: {
      async onSave() {
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($boardId: ID! $title: String! $descr: String) {
                updateBoard(
                    boardId: $boardId
                    title: $title
                    descr: $descr
                ) {
                    title
                    descr
                  }
                }`,
            variables: {
              boardId: this.boardId,
              title: this.title,
              descr: this.descr
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          const {updateBoard} = data;
          this.board = updateBoard;
          this.isToolbarEdit = false;
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
      onColumnUpdate(data) {
        if (data) {
          const {createBoardColumn, updateBoardColumn, deleteBoardColumn} = data;
          if (createBoardColumn) {
            this.boardColumns.push(createBoardColumn);
          } else if (updateBoardColumn) {
            this.boardColumns.some(column => {
              if (column._id === updateBoardColumn._id) {
                column.title = updateBoardColumn.title;
                return true
              }
            })
          } else if (deleteBoardColumn) {
            const idx = this.boardColumns.findIndex(({_id}) => _id === deleteBoardColumn._id);
            this.boardColumns.splice(idx, 1);
          }
        }
        this.isColumnAdd=false
      },
      onColumnDragStart () {
        this.columnsOrderBeforeDrag = this.boardColumns.map(({_id}) => _id)
      },
      async onColumnDragEnd() {
        const columnIds = this.boardColumns.map(({_id}) => _id);
        let condition = true;
        for (let i = 0; i < columnIds.length; i++) {
          if (columnIds[i] !== this.columnsOrderBeforeDrag[i]) {
            condition = false;
            break
          }
        }
        if (condition) return;
        try {
          const {data} = await this.$apollo.mutate({
            mutation: gql`mutation ($boardId: ID! $columnIds: [ID!]!) {
                dragColumnInBoard(
                    boardId: $boardId
                    columnIds: $columnIds
                ) {
                    columns {
                        _id
                        title
                        tasks {
                            _id
                            title
                        }
                    }
                  }
                }`,
            variables: {
              boardId: this.boardId,
              columnIds: columnIds
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          const {dragColumnInBoard} = data;
          this.boardColumns = dragColumnInBoard.columns;
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
      onTaskDrag (data) {
        const {dragTaskInColumn} = data;
        if (dragTaskInColumn) {
          this.boardColumns.some(column => {
            if (column._id === dragTaskInColumn._id) {
              column.tasks = dragTaskInColumn.tasks
              return true
            }
          })
        }
      },
      onTaskInColumnUpdate (data) {
        const {createBoardTask, updateBoardTask, deleteBoardTask} = data;
        if (createBoardTask) {
          this.boardColumns.some(column => {
            if (column._id === createBoardTask.column._id) {
              const tasks = column.tasks ? column.tasks : [];
              tasks.push(createBoardTask);
              column.tasks = tasks;
              return true
            }
          })
        } else if (updateBoardTask) {
          this.boardColumns.some(column => {
            if (column._id === updateBoardTask.column._id && column.tasks) {
              column.tasks.some(task => {
                if (task._id === updateBoardTask._id) {
                  task.title = updateBoardTask.title;
                  return true
                }
              });
              return true
            }
          })
        } else if (deleteBoardTask) {
          this.boardColumns.some(column => {
            if (column._id === deleteBoardTask.column._id) {
              const idx = column.tasks.findIndex(({_id}) => _id === deleteBoardTask._id);
              column.tasks.splice(idx, 1);
              return true
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
