import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
import store from './store'


Vue.use(VueApollo);


const AUTH_TOKEN = 'apollo-token';

export const {apolloClient} = createApolloClient({
  httpEndpoint: process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql',
  wsEndpoint: null,
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
});

export function createProvider () {
  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'network-only'
      }
    },
    async errorHandler (error) {
      store.commit('setError', error);
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
    // // global query loading handler
    // watchLoading (isLoading) {
    //   store.commit('setLoading', isLoading)
    // },
  });
}

// Manually call this when user log in
export async function onLogin (apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) {
    restartWebsockets(apolloClient.wsClient);
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout (apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }
  if (apolloClient.wsClient) {
    restartWebsockets(apolloClient.wsClient);
  }
  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
