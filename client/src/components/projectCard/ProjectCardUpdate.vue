<template>
    <v-card height="240">
        <v-card-title>
            <v-text-field
                    v-model.trim="title"
                    class="my-0 py-0"
                    label="Title"
                    single-line
                    clearable
            ></v-text-field>
        </v-card-title>
        <v-card-text class="pb-0">
            <v-textarea
                    v-model.trim="descr"
                    class="my-0 py-0"
                    label="Description"
                    no-resize
                    rows="4"
                    clearable
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="onSave"
                   :loading="loading"
                   text>
                Save
            </v-btn>
            <v-btn @click="$emit('update')"
                   text>
                Cancel
            </v-btn>
        </v-card-actions>
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
        loading: false,
        title: this.project && this.project.title || null,
        descr: this.project && this.project.descr || null
      }
    },
    methods: {
      async onSave() {
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
</script>

<style scoped>

</style>
