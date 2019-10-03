<template>
    <v-card class="ma-1 red lighten-3">
        <v-card-text class="py-0">
            <v-textarea
                    v-model.trim="text"
                    class="my-0 py-0"
                    no-resize
                    rows="4"
                    clearable
                    hide-details
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-btn @click
                   :loading="loading"
                   x-small text>
                Save
            </v-btn>
            <v-btn @click
                   x-small text>
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  export default {
    name: "BoardTask",
    data () {
      return {
        loading: false,
        text: null
      }
    }
  }
</script>

<style scoped>

</style>
