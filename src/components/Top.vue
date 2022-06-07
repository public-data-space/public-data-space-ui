<template>
  <div>
    <v-app-bar 
      clipped-left 
      elevate-on-scroll 
      elevation="6"
      style="z-index:9999;"
    >      
      <div class="pl-1">
        <router-link to="/">
          <img src="@/assets/images/fokus_85mm_CMYK_2016.svg" alt="Fraunhofer FOKUS Logo" class="nav-logo">
        </router-link>
      </div>

      <v-spacer></v-spacer>
      
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- USER AUTHENTICATED -->
      <v-avatar v-if="isAuthenticated" class="nav-user-name">AD</v-avatar>
      <v-btn v-if="isAuthenticated" @click="logout()" elevation="8" fab icon class="nav-user-auth">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
      <!-- USER NOT AUTHENTICATED -->
      <v-btn v-if="!isAuthenticated" to="Login" elevation="8" fab icon class="nav-user-auth">
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
       
      permanent
      absolute
      expand-on-hover
      mini-variant-width="80"
      :mini-variant.sync="mini"
      class="nav-drawer"
    >
    <!-- 
<v-navigation-drawer
      permanent
      prominent
      clipped
      fixed
      :expand-on-hover="useExpandDrawerOnHover"
      class="nav-drawer"
    >
-->

      <v-list nav class="nav-list">
        <v-list-item class="px-2">
          <img src="@/assets/images/fokus-logo.svg" alt="Fraunhofer FOKUS Logo" class="nav-logo">
        </v-list-item>

        <br>

        <router-link v-for="item in navItems.top" :key="item.title" :to="{ name: item.linkTo }" class="nav-link">
          <v-list-item class="nav-item">
            <v-list-item-icon>
              <v-icon class="nav-icon" dark>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="nav-title white--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <br>

        <v-divider></v-divider>
        
        <br>

        <router-link v-for="item in navItems.bottom" :key="item.title" :to="{ name: item.linkTo }" class="nav-link">
          <v-list-item class="nav-item">
            <v-list-item-icon>
              <v-icon class="nav-icon" dark>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-list-item-title class="nav-title white--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-footer app bottom fixed padless>
     <v-layout justify-center>
       <v-btn
        class="ma-1"
        color="grey"
        plain
        x-small
        @click="imprint"
      >
        Impressum
      </v-btn>

      <v-btn
        class="ma-1"
        color="grey"
        plain
        x-small
        @click="privacy"
      >
     Datenschutz
      </v-btn>
     </v-layout>
  </v-footer>
  </div>
  
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../config/user-config';

export default {
  name: 'Top',
  data () {
    return {
      title: GLUE_CONFIG.title,
      useExpandDrawerOnHover: GLUE_CONFIG.expandDrawerOnHover,
      navItems: (localStorage.getItem('jwt') !== null) ? GLUE_CONFIG.navItems : GLUE_CONFIG.navItemsWithoutAuth,
      snackbarTextSubmitSuccess: GLUE_CONFIG.snackbarTexts.auth.logout.success,
      mini: true,
    };
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem('jwt') !== null;
    },
  },
  methods: {
    logout() {
      if (localStorage.getItem('jwt') !== null) {
        this.$store.dispatch('updateStatus', { status: 'success', text: this.snackbarTextSubmitSuccess });
        localStorage.removeItem('jwt');
        this.$store.dispatch('logout');
        this.$router.push({ name: 'Login' });
      }
    },
    imprint(){
      this.$router.push({ name: 'Imprint' });
    },
privacy(){
      this.$router.push({ name: 'Privacy' });
    }

  },
};
</script>

<style lang="scss">
.nav-logo {
  width: auto !important;
  height: 64px !important;
  padding-top: 12px !important;
}

.nav-user-name {
  margin-right: 1% !important;
  font-weight: bold !important;
  font-size: 150% !important;
  color: #239b7e !important;
  background-color: #D0D0D0 !important;
}

.nav-user-auth {
  font-weight: bold !important;
  font-size: 150% !important;

  .v-icon {
    color: #239b7e !important;
  }

  &:hover {
    .v-icon {
        color: #E96A22 !important;
      }
  }
  
}

.nav-drawer {
  background-color: #239b7e !important;
  color: white !important;

  .nav-list {
    position: relative !important;
    height: 100% !important;

    .nav-logo {
      width: auto !important;
      height: 50px !important;
    }

    .nav-item {

      .nav-link {
        color: white !important;
      }

      .nav-icon {
        margin-top: 5px !important;
      }

      &:hover {
        background-color: white !important;

        .nav-icon, .nav-title {
          color: #E96A22 !important;
        }
      }
    }
  }
}
</style>