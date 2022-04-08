<template>
  <div style="color:#E96A22">
    <div v-if="jsonLoaded"><vue-json-pretty :path="'res'" :data="json" :showLength="true" :showDoubleQuotes="false"></vue-json-pretty></div>
    <div v-else class="text-center" style="position:absolute;top:35%;left:47.5%;">
      <span >{{ text }}</span>
      <br>
      <br>
      <br> 
      <v-progress-circular
        indeterminate
        color="accent"></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: "Connector",
  data() {
    return {
      text: GLUE_CONFIG.connector.text,
      jsonLoaded: false,
      json: {
        no: 'data',
      },
      snackbarTextLoadSuccess: GLUE_CONFIG.snackbarTexts.connector.load.success,
      snackbarTextLoadError: GLUE_CONFIG.snackbarTexts.connector.load.error,
    };
  },
  methods: {
    getJSON() {
      this.$axios({
        method: 'GET',
        url: new URL('/about', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        this.json = JSON.parse(JSON.stringify(response.data));
        this.$store.dispatch('updateStatus', { status: 'success', text: this.snackbarTextLoadSuccess });
      })
      .catch(() => {
        this.$store.dispatch('updateStatus', { status: 'error', text: this.snackbarTextLoadError });
      })
      .finally(() => {
        this.jsonLoaded = true;
      });
    },
  },
  mounted() {
    this.getJSON();
  },
};
</script>