<template>
  <v-card>
    <v-img
      :src="image.urls.small"
      :alt="image.alt_description"
    />
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
  }
}
</script>
