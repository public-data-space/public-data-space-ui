<template>
  <v-container class="ml-n16">
    <v-card>
      <v-card-title style="color: #e96a22">{{ this.$route.query.id }} Title</v-card-title>
      <v-card-subtitle v-text="getDataAssetTitle"></v-card-subtitle>
    </v-card>

    <br>
    <v-row align="stretch">

      <v-col cols="8">

        <v-card>
          <v-card-title style="color: #e96a22">Keywords</v-card-title>
          <v-card-subtitle v-text="this.keywords"> </v-card-subtitle>
        </v-card>
        <br>

        <span v-if="getDataAssetStatus === 'PUBLISHED'">
          <v-card>
            <v-card-title style="color: #e96a22">Access URL</v-card-title>
            <v-card-subtitle v-html="this.accessURL"></v-card-subtitle>
          </v-card>
          <br>
        </span>
        <v-card>
          <v-card-title style="color: #e96a22">Description</v-card-title>
          <v-card-subtitle v-html="getDataAssetDescription"> </v-card-subtitle>
        </v-card>
        <br>
        <v-card>
          <v-card-title style="color: #e96a22">Datasource Name</v-card-title>
          <v-card-subtitle v-text="getDataSourceName"> </v-card-subtitle>
        </v-card>
        <br>
        <v-card>
          <v-card-title style="color: #e96a22">Datasource Type</v-card-title>
          <v-card-subtitle v-text="getDataSourceType"> </v-card-subtitle>
        </v-card>
        <br>
        <v-card>
          <v-card-title style="color: #e96a22">Doi</v-card-title>
          <v-card-subtitle v-text="getDataAssetDoi"></v-card-subtitle>
        </v-card>
        <br>
        <v-card>
          <v-card-title style="color: #e96a22">Author</v-card-title>
          <v-card-subtitle v-text="getDataAssetAuthor"></v-card-subtitle>
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
            <v-data-table :headers="this.fileSizeHeaders" :items="getDataAssetFileSize" :items-per-page="3" class="elevation-1">
              <template v-slot:item.pull="{ item }">
              </template>
            </v-data-table>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card hover>
          <v-card-title style="color: #e96a22">Actions</v-card-title>
          <v-card-subtitle>
            <br>
            <span v-if="getDataAssetStatus === 'APPROVED'">
              <v-btn dark block color="accent" v-on:click="publishAction(getDataAssetId)">
                Publish
              </v-btn>
              <br>
            </span>

            <span v-if="getDataAssetStatus === 'PUBLISHED'">
              <v-btn dark block color="accent" v-on:click="unpublishAction(getDataAssetId)">
                Unpublish
              </v-btn>
              <br>
            </span>
            <v-btn dark block color="accent" v-on:click="deleteAction(getDataAssetId)">
              Delete
            </v-btn>
            <br>
            <v-btn dark block color="accent" v-on:click="generateKeywords(getDataAssetId)">
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

function updateURL(description, url, id) {
  var resourceCatalog = description["ids:resourceCatalog"];
  if (resourceCatalog !== undefined) {
    var offeredResources = resourceCatalog[0]["ids:offeredResource"];
    if (offeredResources !== undefined) {
      for (var i = 0; i < offeredResources.length; i++) {
        if (offeredResources[i]["@id"] === url + "DataResource/" + id || offeredResources[i]["@id"].replace("http://", "") === url + "DataResource/" + id) {
          var result = "";
          var endpoints = offeredResources[i]["ids:resourceEndpoint"];
          for (var j = 0; j < endpoints.length; j++) {
            result += endpoints[j]["ids:endpointArtifact"]["ids:fileName"] + "&nbsp;&nbsp;&nbsp;&nbsp;";
            result += "<a href=\"" + endpoints[j]["ids:accessURL"]["@id"] + "\">" + endpoints[j]["ids:accessURL"]["@id"] + "</a><br>";
          }
          return result;
        }
      }
    }
  }
  return '';
}

export default {
  name: "DataAsset",
  created() {
    var keys = this.$store.state.persistedStore.dataAssetItem.tags;
    if (typeof keys !== "string") {
    var results = "";
    for (var i = 0; i < keys.length; i++) {
      results += keys[i] + ", "
    }
    results = results.substring(0, results.length - 2);
    this.keywords = results;
    } else {
      this.keywords = keys;
    }

    this.accessURL = updateURL(this.$store.state.connectorSelfDescription, this.$env.apiBaseUrl, this.$store.state.persistedStore.dataAssetItem.id);
  },
  data() {
    return {
      accessURL: '',
      keywords: '',
      title: GLUE_CONFIG.dataAssets.title,
      fileSizeHeaders: [
        { text: 'Name', value: 'name', width: "60%", align: "center" },
        { text: 'Size', value: 'size', width: "20%", align: "center" }
      ],
      snackbarTextPublishSuccess:
        GLUE_CONFIG.snackbarTexts.dataAssets.publish.success,
      snackbarTextPublishError:
        GLUE_CONFIG.snackbarTexts.dataAssets.publish.error,
      snackbarTextUnpublishSuccess:
        GLUE_CONFIG.snackbarTexts.dataAssets.unpublish.success,
      snackbarTextUnpublishError:
        GLUE_CONFIG.snackbarTexts.dataAssets.unpublish.error,
      snackbarTextDeleteSuccess:
        GLUE_CONFIG.snackbarTexts.dataAssets.delete.success,
      snackbarTextDeleteError:
        GLUE_CONFIG.snackbarTexts.dataAssets.delete.error,
      snackbarTextKeywordsSuccess:
        GLUE_CONFIG.snackbarTexts.dataAssets.keywords.success,
      snackbarTextKeywordsError:
        GLUE_CONFIG.snackbarTexts.dataAssets.keywords.error,
    };
  },
  methods: {
    generateKeywords(id) {
      this.$axios({
        method: "GET",
        url: new URL(
          "/api/dataassets/" + id + "/tags",
          this.$env.apiBaseUrl
        ),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          this.keywords = response.data["tags"];
          this.$store.commit("saveTags", response.data["tags"]);
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextKeywordsSuccess,
          });
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextKeywordsError,
          });
        });
        
    },
    publishAction(id) {
      this.$axios({
        method: "GET",
        url: new URL(
          "/api/dataassets/" + id + "/publish",
          this.$env.apiBaseUrl
        ),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then(() => {
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextPublishSuccess,
          });
          this.$store.state.persistedStore.dataAssetItem.status = "PUBLISHED";
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextPublishError,
          });
        });
      this.$axios({
        method: 'GET',
        url: new URL('/about', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
        .then(response => {
          var connector = JSON.parse(JSON.stringify(response.data));
          this.$store.dispatch('updateDescription', connector);
          this.accessURL = updateURL(connector, this.$env.apiBaseUrl, this.$store.state.persistedStore.dataAssetItem.id)
        })
    },
    unpublishAction(id) {
      this.$axios({
        method: "GET",
        url: new URL(
          "/api/dataassets/" + id + "/unpublish",
          this.$env.apiBaseUrl
        ),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then(() => {
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextUnpublishSuccess,
          });
          this.$store.state.persistedStore.dataAssetItem.status = "APPROVED";
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextUnpublishError,
          });
        });
    },
    deleteAction(id) {
      this.$axios({
        method: "DELETE",
        url: new URL("/api/dataassets/" + id + "/delete", this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then(() => {
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextDeleteSuccess,
          });
          this.$router.push('DataAssets') 

        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextDeleteError,
          });
        });
    },
    downloadFile(id) {
      let fileInfo = this.getDataSourceType + "/" + (this.getDataAssetDoi.includes("/")? this.getDataAssetDoi.replace("/", "<slash>") : this.getDataAssetDoi) + "/" + id;
      this.$axios({
        method: 'GET',
        url: new URL('/api/dataassets/getResource/' + fileInfo , this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        window.open(response.data)
      })
    },
  },
  computed: {
    sources() {
      return this.$store.state.sources;
    },
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
    getDataAssetDescription() {
      return this.$store.state.persistedStore.dataAssetItem.description;
    },
    getDataAssetStatus() {
      return this.$store.state.persistedStore.dataAssetItem.status;
    },
    getDataAssetId() {
      return this.$store.state.persistedStore.dataAssetItem.id;
    },
    getDataSourceType(){
      return this.$store.state.persistedStore.dataAssetDataSourceType;
    },
    getDataSourceName(){
      return this.$store.state.persistedStore.dataAssetDataSourceName;
    },
    getDataAssetFileSize() {
      let disFilesSizes = [];
      this.$store.state.persistedStore.dataAssetItem.distributions.forEach(e => {
        disFilesSizes.push({
          "name": e.filename,
          "size": e.additionalmetadata.byte_size[0],
          "pull": e.id,
        })
      });
      return disFilesSizes;
    }
  }
};
</script>