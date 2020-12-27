<template>
  <v-card max-width="300">
    <v-card-text>
      <v-item-group
        v-model="color_"
        @change="e => $emit('update:color', e)"
      >
        <v-item
          v-for="c in Object.values(colors)"
          v-slot="{ active, toggle }"
          :key="c"
          :value="c"
        >
          <v-btn
            :title="c"
            :input-value="active"
            icon
            class="pa-2"
            @click="toggle"
          >
            <v-icon v-if="c == colors.BLACK_AND_WHITE">
              mdi-circle-half-full
            </v-icon>
            <v-icon v-else-if="c == colors.BLACK">
              mdi-circle-outline
            </v-icon>
            <v-icon v-else-if="c == colors.MAGENTA" color="pink darken-1">
              mdi-circle
            </v-icon>
            <v-icon v-else :color="c">
              mdi-circle
            </v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-item-group
        v-model="orientation_"
        @change="e => $emit('update:orientation', e)"
      >
        <v-item
          v-for="o in Object.values(orientations)"
          v-slot="{ active, toggle }"
          :key="o"
          :value="o"
        >
          <v-btn
            :title="o"
            :input-value="active"
            icon
            class="pa-2"
            @click="toggle"
          >
            <v-icon v-if="o == orientations.SQUARISH">
              mdi-crop-square
            </v-icon>
            <v-icon v-else>
              mdi-crop-{{ o }}
            </v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-spacer />
      <!--  -->
    </v-card-text>
  </v-card>
</template>

<script>
import { colors, orientations } from '~/api/unsplash'

export default {
  props: {
    color: {
      type: String,
      default: () => null
    },
    orientation: {
      type: String,
      default: () => null
    }
  },
  data () {
    return {
      colors,
      color_: null,
      orientations,
      orientation_: null
    }
  },
  watch: {
    color (e) {
      this.color_ = e
    },
    orientation (e) {
      this.orientation_ = e
    }
  }
}
</script>
