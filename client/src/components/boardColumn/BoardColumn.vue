<template>
    <v-col cols="2">
        <v-card flat min-heigth="300">
            <v-card-title>
                {{column.title}}
            </v-card-title>
        </v-card>
        <v-sheet min-height="244" class="pa-3 body-2">
            Tasks
        </v-sheet>
    </v-col>
</template>

<script>
  export default {
    name: "BoardColumn",
    props: {
      column: Object
    }
  }
</script>

<style scoped>

</style>
