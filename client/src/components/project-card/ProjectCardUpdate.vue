<template>
    <v-card height="240">
        <v-card-title>
            <v-text-field
                    v-model="title"
                    class="my-0 py-0"
                    label="Title"
                    single-line
                    clearable
            ></v-text-field>
        </v-card-title>
        <v-card-text class="pb-0">
            <v-textarea
                    v-model="descr"
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
            <v-btn @click="$emit('edit-close')"
                   text>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    name: "ProjectCardUpdate",
    props: {
      project: Object
    },
    data () {
      return {
        loading: false,
        title: this.project && this.project.title || null,
        descr: this.project && this.project.descr || null,
        updatedAt: this.project && this.project.updatedAt || null
      }
    },
    methods: {
      async onSave() {
        let result;
        try {
          if (this.project && this.project._id) {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($projectId: ID!, $title: String!, $descr: String) {
                updateProject(
                    projectId: $projectId
                    title: $title
                    descr: $descr
                ) {
                    _id
                    title
                    descr
                    updatedAt
                  }
                }`,
              variables: {
                projectId: this.project._id,
                title: this.title,
                descr: this.descr
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            })
          } else {
            result = await this.$apollo.mutate({
              mutation: gql`mutation ($title: String!, $descr: String) {
                createProject(
                    title: $title
                    descr: $descr
                ) {
                    _id
                    title
                    descr
                    updatedAt
                  }
                }`,
              variables: {
                _id: this._id,
                title: this.title,
                descr: this.descr
              },
              watchLoading(isLoading) {
                this.loading = isLoading
              }
            });
          }
          const {data} = result;
          this.$emit('edit-close', data)
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
