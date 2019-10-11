import { apolloClient } from '.././vue-apollo'
import gql from 'graphql-tag'


export default {
  state: {
    title: null,
    descr: null,
    columns: []
  },
  mutations: {
    setBoard (state, payload) {
      state.title = payload.title;
      state.descr = payload.descr;
    },
    setColumns (state, payload) {
      state.columns = payload.columns
    }
  },
  actions: {
    async getBoardFromApi ({ commit }, boardId) {
      commit('setLoading', true);
      try {
        const {data} = await apolloClient.query({
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
          variables: {
            boardId
          }
        });
        const {title, descr, columns} = data.board;
        commit('setBoard', {title, descr});
        commit('setColumns', {columns});
      } catch (error) {
        commit('setError', error);
        console.error(error)
      }
      commit('setLoading', false);
    },
    async updateBoard ({commit, dispatch}, {boardId, title, descr}) {
      try {
        const {data} = await apolloClient.mutate({
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
            boardId, title, descr
          }
        });
        const {updateBoard} = data;
        commit('setBoard', updateBoard);
      } catch (error) {
        commit('setError', error);
        console.error(error);
        dispatch('getBoardFromApi')
      }
    },
    async dragColumnInBoard ({commit, dispatch}, {boardId, columnIds}) {
      try {
        const {data} = await apolloClient.mutate({
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
            boardId, columnIds
          }
        });
        const {dragColumnInBoard} = data;
        commit('setColumns', dragColumnInBoard)
      } catch (error) {
        commit('setError', error);
        console.error(error);
        dispatch('getBoardFromApi')
      }
    }
  }
}
