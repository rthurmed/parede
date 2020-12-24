<template>
  <v-card max-width="300">
    <v-card-text>
      <v-item-group v-model="color">
        <v-item
          v-for="c in Object.values(colors)"
          :key="c"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :value="c"
            :title="c"
            :input-value="active"
            class="pa-2"
            icon
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
      <v-item-group v-model="orientation">
        <v-item
          v-for="o in Object.values(orientations)"
          :key="o"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :title="o"
            :input-value="active"
            class="pa-2"
            icon
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
  data () {
    return {
      colors,
      color: '',
      orientations,
      orientation: ''
    }
  }
}
</script>
