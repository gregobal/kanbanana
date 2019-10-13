<template>
    <v-container v-if="board">
        <v-card>
            <v-toolbar dense flat>
                <v-toolbar-title>
                    <v-text-field v-if="isToolbarEdit"
                                  v-model.trim="title"
                                  :error="!title"
                                  required
                                  class="mt-4"
                                  label="Title"
                                  single-line
                                  clearable>
                    </v-text-field>
                    <span v-else>Board: <span class="font-weight-bold">{{board.title}}</span></span>
                </v-toolbar-title>
                <div class="flex-grow-1"></div>
                <v-toolbar-title>
                    <span v-if="isToolbarEdit">
                        <v-btn class="mr-1"
                               fab x-small outlined
                               :loading="loading"
                               :disabled="!title"
                               @click="onSave">
                            <v-icon small>save</v-icon>
                        </v-btn>
                        <v-btn fab x-small outlined
                               :loading="loading"
                               @click="onCancel">
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
                <v-row class="body-2">
                    <v-col cols="11">
                        <v-text-field v-if="isToolbarEdit"
                                      v-model.trim="descr"
                                      class="mt-4"
                                      label="Description"
                                      single-line
                                      clearable>
                        </v-text-field>
                        <span v-else><span class="font-weight-medium">Description: </span>{{board.descr}}</span>
                    </v-col>
                </v-row>
            </v-toolbar>
            <draggable :list="columns"
                       handle=".column-handle"
                       @start="onColumnDragStart"
                       @end="onColumnDragEnd"
                       class="ma-3 green lighten-5 d-flex justify-center align-start">
                <board-column v-for="column in columns" :key="column._id"
                              :column="column"
                              :board-id="boardId">
                </board-column>
                <v-col cols="2" v-if="isColumnAdd">
                    <board-column-update :board-id="boardId"
                                         @update="isColumnAdd=false">
                    </board-column-update>
                </v-col>
                <v-btn v-if="!isColumnAdd && columns.length < 6"
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
        columnsOrderBeforeDrag: []
      }
    },
    computed: {
      board: function () {
        const {title, descr} = this.$store.state.board;
        return {title, descr}
      },
      columns: function () {
        return this.$store.state.board.columns
      }
    },
    watch: {
      board: function () {
        this.title = this.board.title;
        this.descr = this.board.descr;
      }
    },
    async mounted () {
      await this.$store.dispatch('getBoardFromApi', this.boardId);
      this.title = this.board.title;
      this.descr = this.board.descr;
    },
    methods: {
      async onSave () {
        if (this.title) {
          await this.$store.dispatch('updateBoard', {
            boardId: this.boardId,
            title: this.title,
            descr: this.descr
          });
          this.isToolbarEdit = false;
        }
      },
      onCancel () {
        this.title = this.board.title;
        this.descr = this.board.descr;
        this.isToolbarEdit = false
      },
      onColumnDragStart () {
        this.columnsOrderBeforeDrag = this.columns.map(({_id}) => _id)
      },
      async onColumnDragEnd() {
        const columnIds = this.columns.map(({_id}) => _id);
        let condition = true;
        for (let i = 0; i < columnIds.length; i++) {
          if (columnIds[i] !== this.columnsOrderBeforeDrag[i]) {
            condition = false;
            break
          }
        }
        if (condition) return;
        await this.$store.dispatch('dragColumnInBoard', {boardId: this.boardId, columnIds})
      }
    }
  }
</script>

<style scoped>

</style>
