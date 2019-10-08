<template>
  <v-container fluid>
    <v-row justify="center">
      <h1 class="headline">Welcome to project boards app</h1>
    </v-row>
    <v-row justify="center">
      <v-col cols="6">
        <blockquote class="blockquote text-justify">
          &nbsp;&nbsp;&nbsp;&nbsp;Project boards on KanBanana help you organize and prioritize your work.
          Create board for yor ToDo list or compound project - it's simple, it's efficiently.
          With project boards, you have the flexibility to create customized workflows that suit your needs.
        </blockquote>
      </v-col>
    </v-row>
    <v-row justify="center">
      <h2 class="title my-3">
        <router-link to="/projects">Just do it.</router-link>
      </h2>
    </v-row>
    <v-row justify="center" v-if="!user">
      <h2 class="subtitle-2">
        Not a member - <router-link to="/register">register</router-link> now.
      </h2>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    user: function () {
      return this.$store.state.user
    }
  }
};
</script>
