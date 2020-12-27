<template>
  <v-container class="pt-6">
    <!-- TOP BAR -->
    <v-app-bar
      flat
      app
      :color="searchMenuOpened ? '' : 'transparent'"
    >
      <v-toolbar-title>
        Parede
      </v-toolbar-title>
      <v-spacer />
      <template v-if="searchMenuOpened">
        <!-- DESKTOP SEARCH FORM -->
        <v-form
          v-if="$vuetify.breakpoint.mdAndUp"
          style="width: 30em; margin-left: 72px"
          @submit.prevent="search"
        >
          <v-text-field
            v-model="query"
            solo
            hide-details
            prepend-inner-icon="mdi-magnify"
            autofocus
            class="mt-10"
          >
            <template v-slot:append>
              <v-btn icon small type="submit">
                <v-icon>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
        <v-spacer />
        <v-btn
          icon
          @click="latest = !latest; search()"
        >
          <v-icon v-if="latest">
            mdi-sort-clock-ascending
          </v-icon>
          <v-icon v-else>
            mdi-sort-ascending
          </v-icon>
        </v-btn>
        <v-menu
          offset-y
          :close-delay="300"
          :close-on-content-click="false"
          :open-on-hover="$vuetify.breakpoint.mdAndUp"
          :nudge-bottom="$vuetify.breakpoint.mdAndUp ? 20 : 80"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-filter
              </v-icon>
            </v-btn>
          </template>
          <DetailedFilter
            :color.sync="color"
            :orientation.sync="orientation"
            class="mx-auto"
            @update:color="search"
            @update:orientation="search"
          />
        </v-menu>
      </template>
      <v-btn
        icon
        :disabled="fetching"
        @click="searchMenuOpened = !searchMenuOpened"
      >
        <v-icon v-if="searchMenuOpened">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-magnify
        </v-icon>
      </v-btn>
      <!-- MOBILE ONLY APP BAR EXTENSION -->
      <template
        v-if="searchMenuOpened && $vuetify.breakpoint.smAndDown"
        v-slot:extension
      >
        <v-form
          class="mx-auto mt-6"
          @submit.prevent="search"
        >
          <v-text-field
            v-model="query"
            solo
            hide-details
            prepend-inner-icon="mdi-magnify"
            style="max-width: 30em"
          >
            <template v-slot:append>
              <v-btn icon small type="submit">
                <v-icon>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
      </template>
    </v-app-bar>
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
      searching: false,
      waitingFetch: false,

      searchMenuOpened: true,
      detailedSearch: false,
      colors,
      orientations,

      query: '',
      color: null,
      orientation: null,
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
  watch: {
    searchMenuOpened (e) {
      if (e === false) {
        this.searching = false

        // Reset filter values
        this.query = ''

        this.reset()
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    search () {
      this.searching = true
      if (this.query !== '') {
        this.reset()
      }
    },
    paginate (p) {
      this.page = p
      if (this.page < 0) {
        this.page = 0
      }
      this.fetch()
    },
    reset () {
      this.page = 0
      this.list = []
      this.mapped = {}
      this.fetch()
    },
    fetch () {
      this.fetching = true

      // Switch between fetching logics
      const action = this.searching
        ? this.fetchSearch()
        : this.fetchList()

      // Both logics share the same then, catch and finally
      action
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
        perPage: this.perPage,
        color: this.color,
        orientation: this.orientation,
        orderBy: this.latest ? 'latest' : 'relevant'
      })
    },
    onIntersect (entries, observer) {
      if (!this.waitingFetch && this.list.length > 0 && entries[0].intersectionRatio >= 0.1) {
        this.waitingFetch = true
        this.page += 1
        this.fetch()
      }
    }
  }
}
</script>
