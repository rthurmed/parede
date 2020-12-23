<template>
  <v-row class="flex-row">
    <v-app-bar
      flat
      app
      color="transparent"
    >
      <v-toolbar-title>
        Parede
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        :disabled="fetching"
      >
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn
        icon
        :disabled="fetching"
        @click="paginate(-1)"
      >
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn
        icon
        :disabled="fetching"
        @click="paginate(1)"
      >
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </v-app-bar>
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
      perPage: 32,
      fetching: true
    }
  },
  watch: {
    '$vuetify.breakpoint.name': 'buildLanes'
  },
  mounted () {
    this.fetch()
  },
  methods: {
    paginate (d) {
      this.page += d
      if (this.page < 0) {
        this.page = 0
      }
      this.fetch()
    },
    fetch () {
      this.fetching = true

      unsplash.photos.list({
        page: this.page,
        perPage: this.perPage
      })
        .then((e) => {
          this.list = e.response.results
          this.buildLanes()
        })
        .catch(console.log)
        .finally(() => {
          this.fetching = false
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
