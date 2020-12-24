<template>
  <v-card>
    <v-img
      :src="image.urls.small"
      :lazy-src="image.urls.thumb"
      :alt="image.alt_description"
      @load="loaded = true"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          />
        </v-row>
      </template>
    </v-img>
    <v-list-item two-line>
      <v-list-item-avatar>
        <v-avatar>
          <v-img :src="image.user.profile_image.small" />
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ image.user.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loaded: false
    }
  }
}
</script>
