<template>
  <v-container class="pt-6">
    <!-- TOP BAR -->
    <v-app-bar
      flat
      app
      :color="searching ? '' : 'transparent'"
    >
      <v-toolbar-title>
        Parede
      </v-toolbar-title>
      <v-spacer />
      <template v-if="searching">
        <v-text-field
          v-if="$vuetify.breakpoint.mdAndUp"
          v-model="query"
          solo
          hide-details
          prepend-inner-icon="mdi-magnify"
          class="mt-10"
          style="max-width: 30em; margin-left: 72px"
          autofocus
        />
        <v-spacer />
        <v-btn
          icon
          @click="latest = !latest"
        >
          <v-icon v-if="latest">
            mdi-sort-clock-ascending
          </v-icon>
          <v-icon v-else>
            mdi-sort-ascending
          </v-icon>
        </v-btn>
        <v-btn
          icon
          @click="detailedSearch = !detailedSearch"
        >
          <v-icon>
            mdi-filter
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        icon
        :disabled="fetching"
        @click="searching = !searching"
      >
        <v-icon v-if="searching">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-magnify
        </v-icon>
      </v-btn>
      <template
        v-if="searching && $vuetify.breakpoint.smAndDown"
        v-slot:extension
      >
        <v-toolbar
          flat
          color="transparent"
          class="mt-6"
        >
          <v-text-field
            v-model="query"
            solo
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="mx-auto"
            style="max-width: 30em"
          />
        </v-toolbar>
      </template>
    </v-app-bar>
    <v-expand-transition>
      <DetailedFilter
        v-if="searching && detailedSearch"
        class="mx-auto"
      />
    </v-expand-transition>
    <!-- CONTENT -->
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
  </v-container>
</template>

<script>
import { unsplash, colors, orientations } from '~/api/unsplash'
import DetailedFilter from '~/components/DetailedFilter'
import ImageCard from '~/components/ImageCard'
import Lanes from '~/components/Lanes'

export default {
  components: { ImageCard, Lanes, DetailedFilter },
  data () {
    return {
      list: [],
      mapped: {},

      page: 0,
      perPage: 24,

      fetching: true,
      waitingFetch: false,

      searching: false,
      detailedSearch: false,
      colors,
      orientations,

      query: '',
      color: '',
      orientation: '',
      latest: false
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
    fetchList () {
      return unsplash.photos.list({
        page: this.page,
        perPage: this.perPage
      })
    },
    fetchSearch () {
      return unsplash.search.getPhotos({
        query: this.query,
        page: this.page,
        perPage: this.perPage
        // TODO add color, orientation & order
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
