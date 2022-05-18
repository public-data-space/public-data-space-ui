<template>
  <v-container class="ml-n16">
    <v-card>
      <v-card-title style="color: #e96a22">{{this.$route.query.id}} Title</v-card-title>
      <v-card-subtitle v-text="getDataAssetTitle"></v-card-subtitle>
    </v-card>
    
    <br>
    <v-row align="stretch" >
    
      <v-col cols="8">
        <v-card>
          <v-card-title style="color: #e96a22">Doi</v-card-title>
          <v-card-subtitle  v-text="getDataAssetDoi"></v-card-subtitle>
        </v-card>

        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Author</v-card-title>
          <v-card-subtitle v-text="getDataAssetAuthor"></v-card-subtitle>
        </v-card>

        <br>

        <v-card>
          <v-card-title style="color: #e96a22">Description</v-card-title>
          <v-card-subtitle> Some Description </v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Access URL</v-card-title>
          <v-card-subtitle> Some URL </v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Datasource Name</v-card-title>
          <v-card-subtitle> Some Name </v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Datasource Type</v-card-title>
          <v-card-subtitle> Some Type </v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Keywords</v-card-title>
          <v-card-subtitle> Some Keywords </v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Data access level</v-card-title>
          <v-card-subtitle v-text="getDataAssetAuthorAccessLevel"></v-card-subtitle>
        </v-card>
        
        <br>
        
        <v-card>
          <v-card-title style="color: #e96a22">Files</v-card-title>
          <v-card-subtitle>
            <v-data-table
              :headers="this.fileSizeHeaders"
              :items="getDataAssetFileSize"
              :items-per-page="3"
              class="elevation-1"
            ></v-data-table>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card hover>
          <v-card-title style="color: #e96a22">Actions</v-card-title>
          <v-card-subtitle>
            <br>
              
            <v-btn
            dark
            block
            color="accent">
              Publish
            </v-btn>

            <br>
              
            <v-btn
            dark
            block
            color="accent">
              Delete
            </v-btn>

            <br>

            <v-btn
            dark
            block
            color="accent">
              Generate keywords
            </v-btn>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row> 
  </v-container> 
</template>

<script>
import { glueConfig as GLUE_CONFIG } from "../../../config/user-config";
import { mapState } from 'vuex';

export default {
  name: "DataAsset",
  data() {
    return {
      title: GLUE_CONFIG.dataAssets.title,
      fileSizeHeaders: [
        { text: 'Name', value: 'name', width: "80%", align: "center"},
        { text: 'Size', value: 'size', width: "20%", align: "center"}
      ],
      };
  },
  computed: {
    getDataAssetTitle() {
      mapState({
        dataAssetItem: state => state.persistedStore.dataAssetItem
      });
      return this.$store.state.persistedStore.dataAssetItem.title;
    },
    getDataAssetDoi() {
      return this.$store.state.persistedStore.dataAssetItem.additionalmetadata.pid[0];
    },
    getDataAssetAuthor() {
      return this.$store.state.persistedStore.dataAssetItem.additionalmetadata.author[0];
    },
    getDataAssetAuthorAccessLevel() {
      return this.$store.state.persistedStore.dataAssetItem.additionalmetadata.data_access_level[0];
    },
    getDataAssetFileSize() {
      let disFilesSizes = [];
      this.$store.state.persistedStore.dataAssetItem.distributions.forEach(e =>{
        disFilesSizes.push({
          "name": e.filename,
          "size": e.additionalmetadata.byte_size[0]
        })
      });

      return disFilesSizes;
    }
  }
  };
</script>