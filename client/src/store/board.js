import { apolloClient } from '.././vue-apollo'
import gql from 'graphql-tag'

import {GET_BOARD} from '../graphql/queries'
import {
  CREATE_BOARD_COLUMN, CREATE_BOARD_TASK,
  DELETE_BOARD_COLUMN, DELETE_BOARD_TASK,
  DRAG_COLUMN_IN_BOARD, DRAG_TASK_IN_COLUMNS,
  UPDATE_BOARD,
  UPDATE_BOARD_COLUMN, UPDATE_BOARD_TASK
} from "../graphql/mutations";


export default {
  state: {
    _id: null,
    title: null,
    descr: null,
    columns: []
  },
  mutations: {
    setBoardId (state, payload) {
      state._id = payload
    },
    setBoard (state, payload) {
      state.title = payload.title;
      state.descr = payload.descr;
    },
    setColumns (state, payload) {
      state.columns = payload
    }
  },
  actions: {
    async getBoardFromApi ({ commit }, boardId) {
      commit('setLoading', true);
      try {
        const {data} = await apolloClient.query({
          query: GET_BOARD,
          variables: {
            boardId
          }
        });
        const {_id, title, descr, columns} = data.board;
        commit('setBoardId', _id);
        commit('setBoard', {title, descr});
        commit('setColumns', columns);
      } catch (error) {
        commit('setError', error);
        console.error(error)
      }
      commit('setLoading', false);
    },
    async updateBoard ({commit}, {boardId, title, descr}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: UPDATE_BOARD,
          variables: {
            boardId, title, descr
          }
        });
        const {updateBoard} = data;
        commit('setBoard', updateBoard);
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async updateBoardColumn({state, commit}, {columnId, title}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: UPDATE_BOARD_COLUMN,
          variables: {
            columnId, title
          }
        });
        const {updateBoardColumn} = data;
        const newColumns = state.columns.map(column => {
          if (column._id === updateBoardColumn._id) {
            column.title = updateBoardColumn.title
          }
          return column
        });
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async createBoardColumn({state, commit}, {boardId, title}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: CREATE_BOARD_COLUMN,
          variables: {
            boardId, title
          }
        });
        const {createBoardColumn} = data;
        const newColumns = [
          ...state.columns,
          createBoardColumn
        ];
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async deleteBoardColumn({state, commit}, {columnId, boardId}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: DELETE_BOARD_COLUMN,
          variables: {
            columnId, boardId
          }
        });
        const {deleteBoardColumn} = data;
        const newColumns = state.columns;
        const idx = newColumns.findIndex(({_id}) => _id === deleteBoardColumn._id);
        if (idx > -1) {
          newColumns.splice(idx, 1);
        }
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async dragColumnInBoard ({commit}, {boardId, columnIds}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: DRAG_COLUMN_IN_BOARD,
          variables: {
            boardId, columnIds
          }
        });
        const {dragColumnInBoard} = data;
        commit('setColumns', dragColumnInBoard.columns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async updateBoardTask({state, commit}, {taskId, title}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: UPDATE_BOARD_TASK,
          variables: {
            taskId, title
          }
        });
        const {updateBoardTask} = data;
        const newColumns = state.columns.map(column => {
          if ('tasks' in column) {
            column.tasks = column.tasks.map(task => {
              if (task._id === updateBoardTask._id) {
                task.title = updateBoardTask.title
              }
              return task
            })
          }
          return column
        });
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async createBoardTask({state, commit}, {columnId, title}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: CREATE_BOARD_TASK,
          variables: {
            columnId, title
          }
        });
        const {createBoardTask} = data;
        const newColumns = state.columns.map(column => {
          if (column._id === columnId) {
            const tasks = 'tasks' in column ? column.tasks : [];
            column = {
              ...column,
              tasks: [
                ...tasks,
                createBoardTask
              ]
            }
          }
          return column
        });
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async deleteBoardTask({state, commit}, {columnId, taskId}) {
      try {
        const {data} = await apolloClient.mutate({
          mutation: DELETE_BOARD_TASK,
          variables: {
            columnId, taskId
          }
        });
        const {deleteBoardTask} = data;
        const newColumns = state.columns.map(column => {
          if ('tasks' in column) {
            const idx = column.tasks.findIndex(({_id}) => _id === deleteBoardTask._id);
            if (idx > -1) {
              column.tasks.splice(idx, 1);
              return {...column}
            }
          }
          return column
        });
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
    async dragTaskInColumns ({state, commit}, {columnId, taskIds}) {
      console.log(taskIds);
      try {
        const {data} = await apolloClient.mutate({
          mutation: DRAG_TASK_IN_COLUMNS,
          variables: {
            columnId, taskIds
          }
        });
        const {dragTaskInColumns} = data;
        const newColumns = state.columns.map(column => {
          if (column._id === dragTaskInColumns._id) {
            column = dragTaskInColumns
          }
          return column
        });
        commit('setColumns', newColumns)
      } catch (error) {
        commit('setError', error);
        console.error(error);
      }
    },
  }
}
