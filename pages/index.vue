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
        @click="paginate(page - 1)"
      >
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn
        icon
        :disabled="fetching"
        @click="paginate(page + 1)"
      >
        <v-icon>
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-text-field
        solo
        hide-details
        :disabled="fetching"
        :value="page"
        style="max-width: 3em"
        @change="e => paginate(e)"
      />
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
          cols="12"
        >
          <ImageCard :image="i" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { unsplash } from '~/api/unsplash'
import ImageCard from '~/components/ImageCard'

export default {
  components: { ImageCard },
  data () {
    return {
      list: [],
      lanes: [],
      cols: 1,
      page: Math.floor(Math.random() * 100),
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
    paginate (p) {
      this.page = p
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
