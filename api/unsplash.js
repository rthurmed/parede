import { createApi } from 'unsplash-js'

export const unsplash = createApi({
  apiUrl: 'http://localhost:8080'
})

export const colors = {
  BLACK_AND_WHITE: 'black_and_white',
  BLACK: 'black',
  WHITE: 'white',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
  PURPLE: 'purple',
  MAGENTA: 'magenta',
  GREEN: 'green',
  TEAL: 'teal',
  BLUE: 'blue'
}

export const orientations = {
  SQUARISH: 'squarish',
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait'
}
