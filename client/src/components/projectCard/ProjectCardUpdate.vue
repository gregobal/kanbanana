<template>
    <v-card height="240">
        <v-form ref="projectForm"
                v-model="valid"
                lazy-validation
                @submit.prevent="onSave">
            <v-card-title>
                <v-text-field v-model.trim="title"
                              :rules="titleRules"
                              required
                              class="my-0 py-0"
                              label="Title"
                              single-line
                              clearable
                ></v-text-field>
            </v-card-title>
            <v-card-text class="pb-0">
                <v-textarea v-model.trim="descr"
                            class="my-0 py-0"
                            label="Description"
                            no-resize
                            rows="4"
                            clearable
                ></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-btn type="submit"
                       :loading="loading"
                       text>
                    Save
                </v-btn>
                <v-btn @click="$emit('update')"
                       text>
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script>
  import {CREATE_PROJECT, UPDATE_PROJECT} from "../../graphql/mutations";
  export default {
    name: "ProjectCardUpdate",
    props: {
      project: Object
    },
    data () {
      return {
        valid: true,
        loading: false,
        title: this.project && this.project.title || null,
        titleRules: [
          v => !!v || 'Title is required',
        ],
        descr: this.project && this.project.descr || null
      }
    },
    methods: {
      async onSave() {
        if (this.$refs.projectForm.validate()) {
          this.loading = true;
          let result;
          try {
            if (this.project && this.project._id) {
              result = await this.$apollo.mutate({
                mutation: UPDATE_PROJECT,
                variables: {
                  projectId: this.project._id,
                  title: this.title,
                  descr: this.descr
                }
              })
            } else {
              result = await this.$apollo.mutate({
                mutation: CREATE_PROJECT,
                variables: {
                  title: this.title,
                  descr: this.descr
                }
              });
            }
            const {data} = result;
            this.$emit('update', data)
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
