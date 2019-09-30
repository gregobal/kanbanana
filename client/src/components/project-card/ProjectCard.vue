<template>
    <div>
        <project-card-update v-if="isEdit"
                             :project="project"
                             @edit-close="onUpdate">
        </project-card-update>
        <v-card min-height="240" v-else>
            <v-card-title class="green lighten-5">
                <v-row align="center" justify="space-between" class="mx-0">
                    <span class="subtitle-1">{{project.title}}</span>
                    <v-btn fab x-small outlined
                           @click="isEdit = true">
                        <v-icon>edit</v-icon>
                    </v-btn>
                </v-row>
            </v-card-title>
            <v-sheet height="130" class="pa-3 body-2">
                {{project.descr}}
            </v-sheet>
            <v-card-actions>
                <v-row align="center" justify="space-around">
                    <v-btn text
                           @click="showBoards = !showBoards">
                        Boards
                        <v-icon>{{showBoards ? 'arrow_drop_up' : 'arrow_drop_down'}}</v-icon>
                    </v-btn>
                    <span class="caption">{{formatDate(project.updatedAt)}}</span>
                </v-row>
            </v-card-actions>
            <boards-list v-if="showBoards"
                         :project-id="project._id">
            </boards-list>
        </v-card>
    </div>
</template>

<script>
  import BoardsList from "../BoardsList";
  import ProjectCardUpdate from "./ProjectCardUpdate";
  export default {
    name: "ProjectCard",
    components: {ProjectCardUpdate, BoardsList},
    props: {
      project: Object
    },
    data () {
      return {
        showBoards: false,
        loading: false,
        isEdit: false
      }
    },
    methods: {
      onUpdate (data) {
        if (data) {
          this.$emit('update', data);
        }
        this.isEdit = false
      },
      formatDate (value) {
        const ms = parseInt(value);
        if (ms) {
          const d = new Date(ms);
          return d.toISOString().substr(0, 19)
        }
      }
    }
  }
</script>

<style scoped>

</style>
