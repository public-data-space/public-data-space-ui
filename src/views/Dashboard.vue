<template>
  <v-container class="ml-n16">
    <v-row dense>
      <v-col cols="8">
        <v-card hover class="d-flex flex-column">
            <v-card-title style="color:#E96A22">{{ title }}</v-card-title>
            <v-card-subtitle>{{ description }}</v-card-subtitle>
            <v-card-actions>
                <v-btn color="accent" outlined :to="{ name: 'Settings' }">{{ updateSettings }}</v-btn>
            </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card hover>
          <v-card-subtitle>
            <v-badge
              bordered
              color="accent"
              :content="0"
              :value="0"
              overlap
            >
              <v-btn
                dark
                block
                color="accent"
                :to="{ name: 'Jobs' }"
              >
                {{ jobs }}
              </v-btn>
            </v-badge>
                        
            <br>

            <v-badge
              bordered
              color="accent"
              :content="0"
              :value="0"
              overlap
            >
              <v-btn
                dark
                block
                color="accent"
                :to="{ name: 'SelectDataSource' }"
              >
                {{ dataSources }}
              </v-btn>
            </v-badge>

            <br>
            
            <v-badge
              bordered
              color="accent"
              :content="counts.dacount"
              :value="counts.dacount"
              overlap
            >
              <v-btn
                dark
                block
                color="accent"
                :to="{ name: 'DataAssets' }"
              >
                {{ dataAssets }}
              </v-btn>
            </v-badge>

            <br>
            
            <v-badge
              bordered
              color="accent"
              :content="counts.publishedcount"
              :value="counts.publishedcount"
              overlap
            >
              <v-btn
                dark
                block
                color="accent"
                :to="{ name: 'DataAssets' }"
              >
                {{ dataAssetsPublished }}
              </v-btn>
            </v-badge>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row> 
  </v-container> 
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../config/user-config';

export default {
  name: 'Dashboard',
  data() {
    return {
      title: GLUE_CONFIG.dashboard.title,
      description: GLUE_CONFIG.dashboard.description,
      updateSettings: GLUE_CONFIG.dashboard.updateSettings,
      dataSources: GLUE_CONFIG.dashboard.dataSources,
      dataAssets: GLUE_CONFIG.dashboard.dataAssets,
      dataAssetsPublished: GLUE_CONFIG.dashboard.dataAssetsPublished,
      jobs: GLUE_CONFIG.dashboard.jobs,
      show: false,
      counts: {
        dacount: 0,
        publishedcount: 0,
      },
    };
  },
  methods:{
    getDataAssetCounts(){
      this.$axios({
        method: 'GET',
        url: new URL('/api/dataassets/counts', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
      .then(response => {
        this.counts.dacount = response.data.dacount;
        this.counts.publishedcount = response.data.publishedcount;
      });
    },
  },
  mounted(){
    this.getDataAssetCounts();
  },
}
</script>

<style>
.v-badge {
  display: block;
}
</style>
