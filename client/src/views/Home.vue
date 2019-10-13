<template>
  <v-container fluid>
    <v-row justify="center">
      <h1 class="headline mx-6 text-center">Welcome to project boards app</h1>
    </v-row>
    <v-row justify="center">
      <v-col lg="4" md="6" sm="10" xs="12">
        <div class="body-1 text-justify font-weight-light">
          &nbsp;&nbsp;&nbsp;&nbsp;Project boards on KanBanana help you organize and prioritize your work.
          Create board for your ToDo list or compound project - it's simple, it's efficiently.
          With project boards, you have the flexibility to create customized workflows that suit your needs.
        </div>
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
