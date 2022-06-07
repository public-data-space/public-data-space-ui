<template>
  <div>
    <v-card hover>
      <v-card-title style="color:#E96A22">{{ title }}</v-card-title>
      <v-card-text>
        {{ description }}
        <v-text-field v-model="configuration.title" label="Connector Titel" id="connectorTitle" name="connectorTitle"></v-text-field>
        <v-text-field v-model="configuration.url" label="Connector URL" id="connectorURL" name="connectorURL"></v-text-field>
        <v-text-field v-model="configuration.maintainer" label="Maintainer" id="connectorMaintainer" name="connectorMaintainer"></v-text-field>
        <v-text-field v-model="configuration.curator" label="Curator" id="connectorCurator" name="connectorCurator"></v-text-field>
        <v-select v-model="geoname"
          label="Konektorstandort"
          id="connectorCountry"
          name="locality"
          :items="getCountryNames"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="submit()" color="accent">
          Ändern
          <v-icon right>mdi-pencil</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import geonames from '@/assets/allCountriesWithGeonames.json'
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: 'Settings',
  data() {
    return {
      title: GLUE_CONFIG.settings.title,
      description: GLUE_CONFIG.settings.description,
      snackbarTextSubmitSuccess: GLUE_CONFIG.snackbarTexts.settings.submit.success,
      snackbarTextSubmitError: GLUE_CONFIG.snackbarTexts.settings.submit.error,
      countries: geonames.geonames,
      geoname: 'Deutschland',
      configuration: {
        title: '',
        url: '',
        maintainer: '',
        curator: '',
        country: '',
      },
    };
  },
  computed: {
    getCountryNames() {
      return this.countries.map((c) => c.countryName);
    },
    getGeonameCountry() {
      let geonameId = '';
      for (let i in this.countries) {
        if (this.countries[i].countryName == this.geoname){
          geonameId = this.countries[i].geonameId;
        }
      }
      return `https://sws.geonames.org/${geonameId}`;
    },
    getConfiguration() {
      let config = this.configuration;
      return config;
    },
  },
  methods:{
    initConfig(){
      this.$axios({
        method: 'GET',
        url: new URL('/api/configuration/get', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        this.configuration.title = response.data.title || '';
        this.configuration.url = response.data.url || '';
        this.configuration.maintainer = response.data.maintainer || '';
        this.configuration.curator = response.data.curator || '';
        this.configuration.country = response.data.country || '';
      });
    },
    submit(){
      if (this.geoname === '') return document.getElementById('connectorCountry').required = true;
      this.configuration.country = this.getGeonameCountry;
      this.$axios({
        method: 'POST',
        url: new URL('/api/configuration/edit', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        data: this.getConfiguration,
      })
      .then(response => {
        this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextSubmitSuccess });
      })
      .catch(response => {
        this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextErrorSuccess });
      });
    },
  },
  created(){
    this.initConfig();
  },
}
</script>

<style>
</style>
