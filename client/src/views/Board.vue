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
                       @start="onDragStart"
                       @end="onDragEnd"
                       class="ma-3 green lighten-5 d-flex justify-center align-start">
                <board-column v-for="boardColumn in boardColumns" :key="boardColumn._id"
                              :column="boardColumn">
                </board-column>
                <board-column-create v-if="isColumnAdd"
                                     :board-id="board._id || boardId"
                                     @create-close="onCloseCreateColumn">
                </board-column-create>
                <v-btn v-if="!isColumnAdd && boardColumns.length < 6"
                       class="ma-6"
                       fab small outlined
                       :loading="loading"
                       @click="isColumnAdd = true">
                    <v-icon>add</v-icon>
                </v-btn>
            </draggable>
        </v-card>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  import Draggable from 'vuedraggable'
  import BoardColumn from "../components/boardColumn/BoardColumn";
  import BoardColumnCreate from "../components/boardColumn/BoardColumnCreate";
  export default {
    name: "Board",
    components: {
      BoardColumnCreate,
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
    watch: {
      board: function (newVal) {
        if (newVal) {
          this.title = newVal.title;
          this.descr = newVal.descr;
          if (newVal.columns) {
            this.boardColumns = newVal.columns;
          }
        }
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
            }
          }
        }`,
        variables () {
          return {
            boardId: this.boardId
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
      onCloseCreateColumn(data) {
        if (data && data.createBoardColumn) {
          this.boardColumns = [
            ...this.boardColumns,
            data.createBoardColumn
          ];
        }
        this.isColumnAdd=false
      },
      onDragStart () {
        this.columnsOrderBeforeDrag = this.boardColumns.map(({_id}) => _id)
      },
      async onDragEnd() {
        const columnsIds = this.boardColumns.map(({_id}) => _id);
        let condition = true;
        for (let i = 0; i < columnsIds.length; i++) {
          if (columnsIds[i] !== this.columnsOrderBeforeDrag[i]) {
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
                    }
                  }
                }`,
            variables: {
              boardId: this.boardId,
              columnIds: columnsIds
            },
            watchLoading(isLoading) {
              this.loading = isLoading
            }
          });
          const {dragColumnInBoard} = data;
          this.boardColumns = dragColumnInBoard.columns;
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
      }
    }
  }
</script>

<style scoped>

</style>
