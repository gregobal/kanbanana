<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        {{hello.message}}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
export default {
  apollo: {
    hello: gql`query {
      hello {
        message
      }
    }`,
  },
};
</script>
