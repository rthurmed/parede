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
    </v-app-bar>
    <v-col cols="12">
      <Lanes
        :length="list.length"
        :cols="cols"
      >
        <template v-slot:default="{ index }">
          <ImageCard
            v-if="list[index] != null"
            :image="list[index]"
            class="mb-6"
          />
        </template>
      </Lanes>
      <v-btn
        v-intersect="{
          handler: onIntersect,
          options: {
            threshold: [0, 0.5, 1.0]
          }
        }"
        text
        block
        disabled
      >
        Loading...
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { unsplash } from '~/api/unsplash'
import ImageCard from '~/components/ImageCard'
import Lanes from '~/components/Lanes'

export default {
  components: { ImageCard, Lanes },
  data () {
    return {
      list: [],
      mapped: {},
      page: 0,
      perPage: 24,
      fetching: true,
      waitingFetch: false
    }
  },
  computed: {
    cols () {
      let cols = 1

      if (this.$vuetify.breakpoint.xl) {
        cols = 4
      } else if (this.$vuetify.breakpoint.mdAndUp) {
        cols = 3
      }

      return cols
    }
  },
  // Will do this automatically since intersects end
  // mounted () {
  //   this.fetch()
  // },
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
          e.response.results.forEach((e) => {
            this.mapped[e.id] = e
          })
          this.list = Object.values(this.mapped)
        })
        .catch(() => {
          // TODO catch error
        })
        .finally(() => {
          this.fetching = false
          this.waitingFetch = false
        })
    },
    onIntersect (entries, observer) {
      if (!this.waitingFetch && entries[0].intersectionRatio >= 0.1) {
        this.waitingFetch = true
        this.page += 1
        this.fetch()
      }
    }
  }
}
</script>
