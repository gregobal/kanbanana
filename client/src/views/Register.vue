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
                                   :loading="loading"
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
  import {REGISTER} from "../graphql/mutations";
  export default {
    name: "Register",
    data: () => ({
      loading: false,
      email: null,
      password: null,
      name: null
    }),
    methods: {
      async register() {
        this.loading = true;
        try {
          const result = await this.$apollo.mutate({
            mutation: REGISTER,
            variables: {
              email: this.email,
              password: this.password,
              name: this.name
            }
          });
          const {data} = result;
          this.$router.push({
            name: 'login',
            params: {
              createUser: {
                ...data.createUser,
                message: 'Now you can log in using your data.'
              }
            }
          })
        } catch (error) {
          this.$store.commit('setError', error);
          console.error(error)
        }
        this.loading = false;
      }
    }
  }
</script>

<style scoped>

</style>
