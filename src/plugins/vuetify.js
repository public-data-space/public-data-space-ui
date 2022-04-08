import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#239b7e',
        accent: '#E96A22',
        error: '#cc0000',
        grey: '#808080',
      },
    },
  },
});
