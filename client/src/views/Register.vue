<template>
    <v-container>
        <v-row class="my-6"
               align="center"
               justify="center">
            <v-col class="mt-6" cols="12" sm="8" lg="6" xl="4">
                <v-form ref="regForm"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="onRegister">
                    <v-card class="elevation-12">
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <span>Welcome!</span>
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-text-field v-model="email"
                                          :rules="emailRules"
                                          required
                                          clearable
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
                                          :rules="passwordRules"
                                          required
                                          clearable
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
                                   type="submit">
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
    data() {
      return {
        valid: true,
        loading: false,
        email: null,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        password: null,
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be at least 8 characters',
        ],
        name: null
      }
    },
    methods: {
      async onRegister() {
        if (this.$refs.regForm.validate()) {
          this.loading = true;
          try {
            const {data, errors} = await this.$apollo.mutate({
              mutation: REGISTER,
              variables: {
                email: this.email,
                password: this.password,
                name: this.name
              }
            });
            this.$router.push({
              name: 'login',
              params: {
                createUser: {
                  email: data.createUser.email,
                  message: 'Now you can log in using your data.'
                }
              }
            });
            if (errors) {
              throw new Error(errors[0])
            }
          } catch (error) {
            this.$store.commit('setError', error);
            console.error(error)
          }
          this.loading = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
