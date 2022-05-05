<template>
<v-container class="ml-n16">
   <v-card>
      <v-card-title style="color: #e96a22">{{this.$route.query.id}} Title</v-card-title>
      <v-card-subtitle> Some Title </v-card-subtitle>
</v-card>

 <br>
 
    <v-row align="stretch" >
      

 
<v-col cols="8">
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
         </v-col>
      <v-col cols="4">
        <v-card hover>
         <v-card-title style="color: #e96a22">Actions</v-card-title>
          <v-card-subtitle>
              <br>
            <v-btn
                dark
                block
                color="accent"
               
              >
               Publish
              </v-btn>
              <br>
              <v-btn
                dark
                block
                color="accent"
               
              >
               Delete
              </v-btn>
              <br>
           <v-btn
                dark
                block
                color="accent"
               
              >
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

export default {
  name: "DataAsset",
  data() {
    return {
      title: GLUE_CONFIG.dataAssets.title,
      };
  },
  
  };
</script>