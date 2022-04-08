<template>
  <div>
    <v-card hover>
      <v-card-text>
        <p class="card-text">
            Data Asset der Datenquelle 
            <strong class="nummer-name-dataset">Nr.{{this.id}}</strong>
            -
            <strong class="nummer-name-dataset">{{this.name}}</strong> registrieren. 
            <br>
            Bitte füllen Sie alle Felder aus.
        </p>
        <ncform :form-schema="getFormSchema()" form-name="dataInput" v-model="formSchema.value" style="margin-left: -13px;" @submit="submit"></ncform>
        <div>
          <span v-if="isFileUpload">
            <br>
            <strong>Files</strong>
            <br>
            <input type="file" ref="fileInput" id="fileInput" multiple @change="changeFile">
            <br>
            <br>
          </span>
          <label class="licensesLabel">
              Lizenz ändern (Default: CC0 1.0)
              <input type="checkbox" name="activeLizenz" value="Lizenz" @click="showMe('divLicenses')" style="margin-left: 10px;">
          </label>
          <div style="display:none;clear:both;" id="divLicenses">
              <v-select id="licenses" class="licenseSelect" name="licenses" v-model="licenseTitle" :items="licenseTitles"></v-select>
              <span class="text--disabled">(Unter Umständen wird diese Auswahl im Datenquellenadapter geändert, z.B. wenn Lizenzinformationen aus externen Quellen vorliegen.)</span>
          </div>
        </div>
        <v-btn @click="submit" class="btn btn-primary" style="margin-top: 20px">Data Asset hinzufügen</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

            
<script>
import licenses from '@/assets/licenses.json'

export default {
  name: 'CreateDataAsset',
  components: {},
  props:['sourceid'],
  data() {
    return {
      file: null,
      licenses: licenses,
      licenseTitle: "CC0 1.0",
      formSchema: {
        type: "object",
        properties: {}
      },
      name: null,
      id: null,
      source: null,
      type: "",
      sources: []
    };
  },
  computed: {
    licenseTitles() {
      return Object.keys(this.licenses).map(l => this.licenses[l].title);
    },
    isFileUpload() {
      return this.type === 'odc-adapter-fileupload';
    }
  },
  beforeMount(){
    this.querySources()
    this.updateParams()
  },
  methods:{
    getFormSchema() {
      let formSchema = this.formSchema;
      delete formSchema.properties['Files'];
      return formSchema;
    },
    showMe(box) {
      var chboxs = document.getElementsByName("activeLizenz");
      var vis = "none";
      for(var i=0;i<chboxs.length;i++) {
        if(chboxs[i].checked){
          vis = "block";
          break;
        }
      }
      document.getElementById(box).style.display = vis;
    },
    updateParams(){
      if(typeof this.sourceid !== 'undefined'){
        this.id = this.sourceid
        this.$axios({
          method: 'GET',
          url: new URL('/api/datasources/find/id/'+this.id, this.$env.apiBaseUrl),
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then(response => {
          this.type=response.data.source.datasourcetype
          this.name = response.data.source.datasourcename

          // Manually remove files from formSchema
          delete this.formSchema.properties['Files']

          this.formSchema = response.data.formSchema
        });
      }
      else{
        this.name = null
        this.id = null
      }
    },
    querySources(){
      this.$axios({
        method: 'GET',
        url: new URL('/api/listAdapters', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(response => {
        this.sources = []
        for( var i in response.data.sort()){
          var adapter = response.data[i]
            this.$axios({
              method: 'GET',
              url: new URL('/api/datasources/find/type/'+adapter.name, this.$env.apiBaseUrl),
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
              }
          })
          .then(response2 => {
            this.sources.push({
              type: response2.data.type,
              sources: response2.data.result
            })
          })
          .catch(error2 => {
            if(error2.response.status === 401){
              this.$store.dispatch('updateStatus', {'status': 'error', 'text': 'Session expired.' })
              this.$router.push('/login')                            
            }
          })    
        }
        this.updateParams()
      })
    },
    changeFile(event) {
      this.file = event.target.files[0]
    },
    submit(){
      let licenseurl = '';
      let licensetitle = '';

      for (let i in this.licenses){
        if (this.licenseTitle === this.licenses[i].title){
          licenseurl = this.licenses[i].url;
          licensetitle = this.licenses[i].title;
        }
      }

      let data;
      let contentType;

      if (this.file) {
        contentType = 'multipart/form-data';
        data = new FormData();
        data.append(this.file.name, this.file);
        data.append('data', JSON.stringify({
          sourceId: this.sourceid,
          data: this.formSchema.value,
          datasourcetype: this.type,
          licenseurl: licenseurl,
          licensetitle: licensetitle
        }));
      } else {
        contentType = 'application/json';
        data = {};
        data.sourceId = this.sourceid;
        data.data = this.formSchema.value;
        data.datasourcetype = this.type;
        data.licenseurl = licenseurl;
        data.licensetitle = licensetitle;
      }


      this.$axios({
        method: 'POST',
        url: new URL('/api/dataassets/add', this.$env.apiBaseUrl),
        data: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': contentType,
        }
      })
      .then(response => {
        this.$store.dispatch('updateStatus', response.data);
        this.$router.push("/job");
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.nummer-name-dataset{
    color: #3498DB;
}
#content{
    width: 970px;
    margin-left: 50px;
}
.__object-form-item{
    margin-top: 0px;
}
.ncform{
    width: 1000px;
}
</style>
