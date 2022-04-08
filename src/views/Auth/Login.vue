<template>
  <div>
    <div class="text-center">
      <p>
        <img src="../../assets/images/ids-white.png" alt="Logo of Industrial data space" class="navbar-logo mx-auto" style="width: auto; height: 50px;">
      </p>
    </div>
    <v-card hover>
      <v-card-title style="color:#E96A22">{{ title }}</v-card-title>
      <v-card-text>
        {{ description }}
        <v-text-field v-model="username" label="Benutzername" id="username" name="username"></v-text-field>
        <v-text-field v-model="password" label="Passwort" id="password" name="password" type="password" @keyup.enter="login()"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="login()" color="accent">
          Login
          <v-icon right>mdi-login</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: 'Login',
  data() {
    return {
      username: null,
      password: null,
      title: GLUE_CONFIG.login.title,
      description: GLUE_CONFIG.login.description,
      snackbarTextSubmitSuccess: GLUE_CONFIG.snackbarTexts.auth.login.success,
      snackbarTextSubmitError: GLUE_CONFIG.snackbarTexts.auth.login.error,
    };
  },
  methods:{
    login() {
      this.$axios({
        method: 'POST',
        url: new URL('/login', this.$env.apiBaseUrl),
        data: {
          username: this.username,
          password: this.password,
        }
      })
      .then(response => {
        if(response.status == 200) {
          this.$store.dispatch('updateStatus', { status: 'success', text: this.snackbarTextSubmitSuccess });
          localStorage.setItem('jwt', response.data);
          this.$store.dispatch('login', { jwt: response.data });
          this.$router.push({ name: 'Dashboard' });
        }
      })
      .catch(() => {
        this.$store.dispatch('updateStatus', { status: 'error', text: this.snackbarTextSubmitError });
      });
    },
  },
};
</script>