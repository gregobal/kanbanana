<template>
    <v-container class="fill-height"
                 fluid>
        <v-row align="center"
               justify="center">
            <v-col cols="12"
                   sm="8"
                   md="4">
                <v-card class="elevation-12">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <span>Welcome back!</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-form>
                            <v-text-field v-model="email"
                                          label="Login"
                                          name="login"
                                          prepend-icon="email"
                                          type="text">
                            </v-text-field>
                            <v-text-field v-model="password"
                                          label="Password"
                                          name="password"
                                          prepend-icon="lock"
                                          type="password">
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn @click="login">
                            <span class="mx-3">Login</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "Login",

    data: () => ({
      email: null,
      password: null
    }),
    methods: {
      async login() {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
            mutation ($email: String!, $password: String!) {
                login(
                    email: $email
                    password: $password
                ) {
                userId
                token
            }
          }`,
            variables: {
              email: this.email,
              password: this.password
            },
          });
          if (result && result.data && result.data.login) {
            const {token, userId} = result.data.login;
            if (token && userId) {
              this.$router.push('/')
            }
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped>

</style>
