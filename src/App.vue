<template>
  <v-app :key="$route.fullPath">
    <Top></Top>
    <v-container>
      <v-row>
        <v-spacer v-if="!useExpandDrawerOnHover"></v-spacer>
        <v-col cols="10" :offset="useExpandDrawerOnHover ? 1 : 0">
          <vue-progress-bar></vue-progress-bar>
          <br>
          <router-view class="mx-5 px-5"></router-view>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarStatus">
      <span class="overline">{{ snackbarText }}</span>
      <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
        
<script>
import { glueConfig as GLUE_CONFIG } from '../config/user-config';
import Top from '@/components/Top.vue';

export default {
  name: 'app',
  components: {
    Top,
  },
  data() {
    return {
      useExpandDrawerOnHover: GLUE_CONFIG.expandDrawerOnHover,
      snackbarTimeout: GLUE_CONFIG.snackbarTimeout,
    };
  },
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar;
      },
      set(value) {
        return this.$store.dispatch('setSnackbar', value)
      },
    },
    snackbarText() {
      return this.$store.state.text;
    },
    snackbarStatus() {
      return this.$store.state.status;
    },
  },
  beforeCreate() {
    if (localStorage.getItem('jwt') !== null) this.$store.dispatch('login', { jwt: localStorage.getItem('jwt') });
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>