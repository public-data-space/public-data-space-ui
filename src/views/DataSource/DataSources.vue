<template>
  <v-row>
    <v-col cols="9">
      <router-view></router-view>
      <p v-if="$route.name === 'SelectDataSource'">{{ text }}</p>
    </v-col>
    <v-col cols="3">
      <div v-for="sourceList in this.orderedUsers" :key="sourceList.type">
        <v-card hover class="mb-1">
          <v-card-title class="d-flex">
            <router-link style="color:#E96A22" :to="{ name: 'CreateDataSource', params: { typeAdapter: sourceList.type }}">
              <v-icon right>mdi-plus</v-icon>
              {{ sourceList.type }}
            </router-link>
            
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <br>
            <div v-if="sourceList.sources.length === 0" class="text-center">No Data Assets available for this type ...</div>
            <div v-for="source in sourceList.sources" :key="source.id" class="d-flex justify-space-between mb-1">
              <div style="width:70%;">
                <v-btn class="text-left" style="width:100%;" :to="{ name: 'CreateDataAsset', params: { sourceid: source.id }}">
                  <v-icon left>mdi-plus</v-icon>
                  <span class="text-truncate" style="max-width:150px">{{ source.datasourcename }}</span>
                </v-btn>
              </div>
              <div>
                <v-btn icon :to="{ name: 'EditDataSource', params: { typeAdapter: sourceList.type, sourceid: source.id }}">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon v-on:click="deleteAction(source.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import _ from 'lodash';
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: 'DataSources',
  components: {},
  data() {
    return {
      title: GLUE_CONFIG.dataSources.title,
      text: GLUE_CONFIG.dataSources.text,
    };
  },
  created() {
    this.$store.dispatch('loadSources', { apiBase: this.$env.apiBaseUrl });
  },
  computed: {
    orderedUsers: function () {
      return _.orderBy(this.sources, 'type')
    },
    sources() {
      return this.$store.state.sources;
    },
  },
  methods:{
    deleteAction(id){
      this.$axios({
        method: 'DELETE',
        url: new URL('/api/datasources/delete/' + id, this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(response => {
        this.$store.dispatch('updateStatus', response.data);
        this.$store.dispatch('loadSources', { apiBase: this.$env.apiBaseUrl });
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: stretch;
}

.dropdown-toggle {
  background-color: #303030;
  border: 1px solid #444;
  display: flex;
  justify-content: center;
}

#sidebar {
  min-width: 250px;
  max-width: 250px;
}

.list-group {
  .facet-header-item {
    border-left: solid #239b7e;
  }
  .facet-title {
    font-weight: 600;
    font-size: 1.1rem;
  }
}

#sidebar.active {
  margin-left: -250px;
}

li a {
  text-decoration: none;
  color: white;
}

li a:hover, li a:active,li a:focus {
  color:#3498DB;
}
</style>