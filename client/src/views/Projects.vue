<template>
    <v-container fluid>
        <v-row justify="center">
            <h1 class="headline">Your projects</h1>
        </v-row>
        <v-divider class="my-3" inset></v-divider>
        <v-row align="start" justify="start">
            <v-col cols="12" sm="4" md="3" xl="2" class="text-center">
                <project-card-update v-if="isAdd"
                                     @update="onUpdate">
                </project-card-update>
                <v-card v-else
                        color="transparent" flat
                        height="240">
                    <v-btn @click="isAdd = true"
                           style="margin-top: 80px"
                           color="success"
                           fab x-large outlined>
                        <v-icon large>add</v-icon>
                    </v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4" md="3" xl="2"
                   v-for="project in projects" :key="project._id">
                <project-card :project="project"
                              @update="onUpdate">
                </project-card>
            </v-col>
        </v-row>
        <v-divider class="my-3"></v-divider>
    </v-container>
</template>

<script>
  import ProjectCard from "../components/projectCard/ProjectCard";
  import ProjectCardUpdate from "../components/projectCard/ProjectCardUpdate";
  import {GET_PROJECTS} from "../graphql/queries";
  export default {
    name: "Projects",
    components: {ProjectCardUpdate, ProjectCard},
    data () {
      return {
        projects: [],
        isAdd: false
      }
    },
    apollo: {
      projects: {
        query: GET_PROJECTS,
        watchLoading (isLoading) {
          this.$store.commit('setLoading', isLoading)
        }
      }
    },
    methods: {
      async onUpdate (data) {
        if (data) {
          const {updateProject, createProject} = data;
          if (updateProject) {
            const idx = this.projects.findIndex(({_id}) => _id === updateProject._id);
            this.projects = [
              ...this.projects.slice(0, idx),
              updateProject,
              ...this.projects.slice(idx + 1)
            ]
          } else if (createProject) {
            this.projects = [
              createProject,
              ...this.projects
            ]
          }
        }
        this.isAdd = false
      }
    }
  }
</script>

<style scoped>

</style>
