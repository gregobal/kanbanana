<template>
  <v-container
          class="fill-height"
          fluid
  >
    <v-row
            align="center"
            justify="center"
    >
      <h1 v-if="hello">{{hello.message}}</h1>
    </v-row>
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
