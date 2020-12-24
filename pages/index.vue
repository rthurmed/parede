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
    <v-col cols="12">
      <Lanes
        :length="list.length"
        :cols="cols"
      >
        <template v-slot:default="{ index }">
          <ImageCard
            :image="list[index]"
            class="mb-6"
          />
        </template>
      </Lanes>
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
      page: Math.floor(Math.random() * 100),
      perPage: 24,
      fetching: true
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
        })
        .catch(() => {
          // TODO catch error
        })
        .finally(() => {
          this.fetching = false
        })
    }
  }
}
</script>
