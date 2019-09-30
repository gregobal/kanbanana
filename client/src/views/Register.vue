<template>
    <v-container class="fill-height"
                 fluid>
        <v-row align="center"
               justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-form>
                    <v-card class="elevation-12">
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <span>Welcome!</span>
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
                            <v-text-field v-model="name"
                                          label="Name"
                                          name="name"
                                          prepend-icon="person"
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
                                   @click="register">
                                <span class="mx-5">Register</span>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "Register",
    data: () => ({
      email: null,
      password: null,
      name: null
    }),
    methods: {
      async register() {
        try {
          const result = await this.$apollo.mutate({
            mutation: gql`
                mutation ($email: String!, $password: String!, $name: String) {
                    createUser(
                        email: $email
                        password: $password
                        name: $name
                    ) {
                        email
                    }
            }`,
            variables: {
              email: this.email,
              password: this.password,
              name: this.name
            }
          });
          const {data} = result;
          if (data && data.createUser) {
            this.$router.push({
              name: 'login',
              params: {
                createUser: {
                  ...data.createUser,
                  message: 'Now you can log in using your data.'
                }
              }
            })
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
