<template>
  <v-row class="flex-row">
    <v-col
      v-for="(lane, lk) in lanes"
      :key="lk"
      :cols="12 / cols"
    >
      <v-row>
        <v-col
          v-for="i in lane"
          :key="i.id"
        >
          <v-card>
            <v-img
              :src="i.urls.small"
              :alt="i.alt_description"
            />
            <v-list-item two-line>
              <v-list-item-avatar>
                <v-avatar>
                  <v-img :src="i.user.profile_image.small" />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ i.user.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { unsplash } from '~/api/unsplash'

export default {
  data () {
    return {
      list: [],
      lanes: [],
      cols: 1,
      page: 0,
      perPage: 48
    }
  },
  watch: {
    '$vuetify.breakpoint.name': 'buildLanes'
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      unsplash.photos.list({
        page: this.page,
        perPage: this.perPage
      })
        .then((e) => {
          this.list = e.response.results
          this.buildLanes()
        })
    },
    buildLanes () {
      let cols = 1
      let col = 0

      if (this.$vuetify.breakpoint.xl) {
        cols = 4
      } else if (this.$vuetify.breakpoint.mdAndUp) {
        cols = 3
      }

      const lanes = []

      this.list.forEach((i) => {
        if (!lanes[col]) {
          lanes[col] = []
        }
        lanes[col].push(i)

        col += 1
        if (col >= cols) {
          col = 0
        }
      })

      this.lanes = lanes
      this.cols = cols
    }
  }
}
</script>
