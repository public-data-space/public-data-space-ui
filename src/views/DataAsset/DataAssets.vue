<template>
  <v-card class="ml-n16">
    <v-card-title style="color: #e96a22">{{ title }}</v-card-title>
    <v-container style="display: flex; align-items: center; padding: initial">
      <v-text-field v-model="search" append-icon="search" label="Search" single-line style="margin-right: 30px">
      </v-text-field>
      <v-select v-model="datasourceType" class="selectAdapter" label="Datasource Type" :items="getAllDatasourceTypes"
        clearable></v-select>
      <v-select v-model="datasourceName" class="selectAdapter" label="Datasource Name" :items="getAllDatasourceNames"
        clearable></v-select>
      <v-switch :disabled="dataassets.length == 0" label="Published" color="accent" class="switch-label"
        v-model="filterPublished"></v-switch>
      <v-switch :disabled="dataassets.length == 0" label="Unpublished" color="grey" class="switch-label"
        v-model="filterUnpublished"></v-switch>
      <v-btn :disabled="dataassets.length == 0" v-if="checkForUnpublished" @click="publishAll" color="accent"
        class="publishAll mr-1">Alle Veröffentlichen</v-btn>
      <v-btn :disabled="dataassets.length == 0" v-if="checkForPublished" @click="unpublishAll" color="grey" dark
        class="unPublishAll">Alle Zurückhalten</v-btn>
    </v-container>
    <v-data-table :headers="headers" :items="filteredItems" :search="search" :expanded.sync="expanded" show-expand
      single-expand item-key="title">
      <template v-slot:expanded-item="{ headers, item }">

        <td :colspan="headers.length">
          <p> </p>
          <p v-html="item.description"></p>
        </td>
      </template>

      <!-- 
        <template v-slot:item.title="{ item }">
          <p :id="'truncateTitle-' + item.id" class="truncateText" style="-webkit-line-clamp:2;">
            {{item.title}}
          </p>
        </template>
        <template v-slot:item.description="{ item }" @click="rowClick(item)">
          <p :id="'truncateNote-' + item.id" class="truncateText text--secondary" style="-webkit-line-clamp:2;">
            {{ item.description }}
          </p>
        </template>
       
       
       
         -->
      <template v-slot:item.datasourceType="{ item }">
        <p>
          {{ getDatasource(item.sourceid).datasourcetype }}
        </p>
      </template>
      <template v-slot:item.datasourceName="{ item }">
        <p>
          {{ getDatasource(item.sourceid).datasourcename }}
        </p>
      </template>
      <template v-slot:item.actions="{ item }">
        <div style="display: flex">
          <span v-if="item.status === 'PUBLISHED'">
            <v-btn color="accent" icon v-on:click="unpublishAction(item.id)">
              <v-icon title="Zurückhalten" aria-hidden="true">publish</v-icon>
            </v-btn>
          </span>
          <span v-if="item.status === 'APPROVED'">
            <v-btn icon v-on:click="publishAction(item.id)">
              <v-icon title="Veröffentlichen" aria-hidden="true">publish</v-icon>
            </v-btn>
          </span>
          <v-btn icon v-on:click="deleteAction(item.id)">
            <v-icon title="Delete" aria-hidden="true">delete</v-icon>
          </v-btn>
        </div>
      </template>
      <template v-slot:item.details="{ item }">
        <!-- <a :href="'/job/' + r.id"> -->
        <a style="color:black" :href="'dataassets/' + item.id" @mouseenter="setDataAssetItem(item)">
          Details
        </a>
      </template>

    </v-data-table>


  </v-card>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { glueConfig as GLUE_CONFIG } from "../../../config/user-config";

export default {
  name: "DataAssets",
  data() {
    return {
      title: GLUE_CONFIG.dataAssets.title,
      itemsPerPage: GLUE_CONFIG.dataAssets.itemsPerPage,
      page: 1,
      pageCount: 0,
      dataassets: [],
      filterPublished: true,
      filterUnpublished: true,
      headers: [
        { text: "Title", value: "title", width: "45%" },
        { text: "Datasource Type", value: "datasourceType", width: "20%" },
        { text: "Datasource Name", value: "datasourceName", width: "20%" },
        { text: "Actions", value: "actions", width: "5%" },
        { text: "Details", value: "details", width: "10%" },
      ],
      search: "",
      datasourcetypes: [],
      datasourceType: "",
      datasourceName: "",
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
      expanded: [],
    };
  },
  beforeMount() {
    this.loadData();
  },
  created() {
    this.$store.dispatch("loadSources", {
      apiBase: this.$env.apiBaseUrl,
      configBase: this.$env.configManagerUrl,
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
      })

  },
  computed: {
    sources() {
      return this.$store.state.sources;
    },
    checkForPublished() {
      return (
        this.dataassets.filter((da) => da.status === "PUBLISHED").length > 0
      );
    },
    checkForUnpublished() {
      return (
        this.dataassets.filter((da) => da.status === "APPROVED").length > 0
      );
    },
    mungedDatasets() {
      return this.dataassets.map((v) => {
        return {
          ...v,
          datasourcetype: this.getDatasource(v.sourceid).datasourcetype,
          datasourcename: this.getDatasource(v.sourceid).datasourcename,
        };
      });
    },
    filteredItems() {
      // FILTER
      // 1. Filter published
      // 2. Filter unpublished
      // 3. Filter type
      // 4. Filter name
      // 5. Filter search
      let filteredDataassetsByStatus = this.dataassets
        .filter((da) => (!this.filterPublished ? da.status === "APPROVED" : da))
        .filter((da) =>
          !this.filterUnpublished ? da.status === "PUBLISHED" : da
        );
      // .filter(da => da)
      // .filter(da => da)
      // .filter(da => da);

      let filteredIDs = [];
      let uniqueFilteredDataassets = [];

      filteredDataassetsByStatus.forEach((e) => {
        if (!filteredIDs.includes(e.id)) {
          filteredIDs.push(e.id);
          uniqueFilteredDataassets.push(e);
        }
      });

      return uniqueFilteredDataassets;
    },
    getAllDatasourceTypes() {
      let datasource = [];
      for (let i in this.dataassets) {
        let id = this.dataassets[i].sourceid;
        let type = this.getDatasource(id).datasourcetype;
        datasource.push(type);
      }
      return datasource;
    },
    getAllDatasourceNames() {
      let datasource = [];
      for (let i in this.dataassets) {
        let id = this.dataassets[i].sourceid;
        let name = this.getDatasource(id).datasourcename;
        datasource.push(name);
      }
      return datasource;
    },
  },
  methods: {
    loadData() {
      this.$axios({
        method: "GET",
        url: new URL("/api/dataassets", this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }).then((response) => {
        this.dataassets = response.data.reverse();
      });
    },
    getDatasource(datasetid) {
      let datasource = [];
      for (let i in this.sources) {
        let result = this.sources[i].sources;
        for (let i2 in result) {
          let result2 = this.sources[i].sources[i2].id;
          if (datasetid == result2) {
            datasource = this.sources[i].sources[i2];
          }
        }
      }
      return datasource;
    },
    publishAll() {
      this.$axios({
        method: "GET",
        url: new URL("/api/dataassets/all/publish", this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then(() => {
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextPublishSuccess,
          });
          this.loadData();
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextPublishError,
          });
        });
    },
    unpublishAll() {
      this.$axios({
        method: "GET",
        url: new URL("/api/dataassets/all/unpublish", this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then(() => {
          this.$store.dispatch("updateStatus", {
            status: "success",
            text: this.snackbarTextUnpublishSuccess,
          });
          this.loadData();
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextUnpublishError,
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
          this.dataassets.find((da) => da.id == id).status = "PUBLISHED";
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextPublishError,
          });
        });
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
          this.dataassets.find((da) => da.id == id).status = "APPROVED";
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
          this.loadData();
        })
        .catch(() => {
          this.$store.dispatch("updateStatus", {
            status: "error",
            text: this.snackbarTextDeleteError,
          });
        });
    },
    rowClick(item) {
      let collapseNote = document
        .getElementById("truncateNote-" + item.id)
        .style.getPropertyValue("-webkit-line-clamp");
      let collapseTitle = document
        .getElementById("truncateTitle-" + item.id)
        .style.getPropertyValue("-webkit-line-clamp");
      if (collapseTitle == 2 || collapseNote == 2) {
        document.getElementById("truncateNote-" + item.id).style =
          "-webkit-line-clamp:none; ";
        document.getElementById("truncateTitle-" + item.id).style =
          "-webkit-line-clamp:none;";
      } else {
        document.getElementById("truncateNote-" + item.id).style =
          "-webkit-line-clamp:2; ";
        document.getElementById("truncateTitle-" + item.id).style =
          "-webkit-line-clamp:2;";
      }
    },
    setDataAssetItem(item) {
      this.$store.commit("saveDataAssetItem", item);
      let datasource = [];
      for (let i in this.sources) {
        let result = this.sources[i].sources;
        for (let i2 in result) {
          let result2 = this.sources[i].sources[i2].id;
          if (item.sourceid == result2) {
            datasource = this.sources[i].sources[i2];
          }
        }
      }
      this.$store.commit("saveDataAssetDataSourceType", datasource.datasourcetype);
      this.$store.commit("saveDataAssetDataSourceName", datasource.datasourcename);

    },
  },
};
</script>

<style scoped>
.switch-label {
  margin-right: 30px;
}

.switch-label .theme--light.v-label {
  margin-bottom: initial;
}

.switch-label .v-input--switch__track {
  color: rgba(255, 255, 255, 0.79) !important;
}

.v-application .switch-label .primary--text {
  color: #3498db !important;
}

.theme--light.v-label--is-disabled {
  color: #4d4d4d !important;
}

.v-input--is-label-active label {
  color: #3498db !important;
}

.theme--light.v-input--switch.v-input--is-disabled:not(.v-input--is-dirty) .v-input--switch__track {
  color: #4d4d4d !important;
}

.theme--light.v-input--switch.v-input--is-disabled:not(.v-input--is-dirty) .v-input--switch__thumb {
  color: #4d4d4d !important;
}

.text-datasource {
  width: 150px;
}

.text-action {
  width: 100px;
}

.publishAll {
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  text-transform: none;
  width: 160px;
}

.unPublishAll {
  text-transform: none;
  width: 160px;
}

.publishAllDisabled {
  text-transform: none;
  width: 160px;
}

.publishAllDisabled .v-btn__content {
  color: #000000;
}

.v-application .primary--text {
  color: white !important;
}

.v-application a {
  color: white;
}

.v-data-footer {
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background-color: #444;
  color: white;
}

.theme--light.v-input input {
  color: white;
}

.v-text-field--single-line {
  color: white !important;
}

.zui-table-highlight tbody tr:hover {
  background-color: rgba(4, 1, 3, 0.22) !important;
}

.v-select__selection--comma {
  color: white !important;
  padding-left: 3px;
}

.theme--light.v-label {
  color: white;
}

.truncateText {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  /* number of lines to show */
  -webkit-box-orient: vertical;
}

.selectAdapter {
  margin-right: 30px;
}

.selectAdapter .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(255, 255, 255, 0.87) !important;
}
</style>