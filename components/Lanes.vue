<template>
  <v-row class="flex-row">
    <v-col
      v-for="col in cols"
      :key="col"
      :cols="12 / cols"
    >
      <slot
        v-for="i in size"
        :index="((i * cols) - cols) + col - 1"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    length: {
      type: Number,
      default: () => 1
    },
    cols: {
      type: Number,
      default: () => 1
    }
  },
  computed: {
    size () {
      return Math.ceil(this.length / this.cols)
    }
  }
}
</script>
