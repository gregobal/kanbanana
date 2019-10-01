<template>
    <v-container>
        <v-row class="my-6"
               align="center"
               justify="center">
            <v-col class="mt-6" cols="12" sm="8" md="4">
                <v-form>
                    <v-card class="elevation-12">
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <span v-if="createUser">Welcome! {{createUser.message}}</span>
                                <span v-else>Welcome back! </span>
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-text-field v-model="email"
                                          label="Email"
                                          name="email"
                                          prepend-icon="email"
                                          type="text">
                            </v-text-field>
                            <v-text-field v-model="password"
                                          label="Password"
                                          name="password"
                                          prepend-icon="lock"
                                          type="password">
                            </v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <div class="flex-grow-1"></div>
                            <v-btn large
                                   @click="login">
                                <span class="mx-5">Login</span>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
        <v-row xs="12">
            <v-col class="text-center">
                <router-link to="/register">Not a member - register now.</router-link>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  import {onLogin} from '../vue-apollo'

  export default {
    name: "Login",
    props: {
      createUser: Object
    },
    data() {
      return {
        email: this.createUser && this.createUser.email || null,
        password: null
      }
    },
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
                        token
                    }
            }`,
            variables: {
              email: this.email,
              password: this.password
            }
          });
          const {data} = result;
          if (data && data.login) {
            await onLogin(this.$apollo.provider.defaultClient, data.login.token);
            await this.$apollo.mutate({
              mutation: gql`mutation ($value: Boolean!) {
                  setIsAuth (value: $value) @client
              }`,
              variables: {
                value: true,
              }
            });
            this.createUser ? this.$router.push('/') : this.$router.back()
          } else {
            const {errors} = result;
            throw new Error(errors[0])
          }
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
