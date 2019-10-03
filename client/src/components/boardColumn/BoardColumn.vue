<template>
    <v-col cols="2">
        <v-card min-heigth="300" class="pb-1">
            <v-card-title>
                {{column.title}}
            </v-card-title>
            <v-sheet min-height="244" class="mx-1 body-2 yellow lighten-5">
                <v-btn x-small text class="ma-1">Add task</v-btn>
                <board-task></board-task>
            </v-sheet>
        </v-card>
    </v-col>
</template>

<script>
  import BoardTask from '../BoardTask';
  export default {
    name: "BoardColumn",
    components: {BoardTask},
    props: {
      column: Object
    }
  }
</script>

<style scoped>

</style>
