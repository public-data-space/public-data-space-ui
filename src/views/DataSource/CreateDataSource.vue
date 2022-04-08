<template>
  <div>
    <v-card hover>
      <v-card-text>
        <p v-if="(typeof this.sourceid !== 'undefined')" class="card-text">
          Datenquelle <strong class="nummer-name-dataset">Nr.{{this.id}}</strong>
          <strong class="nummer-name-dataset">{{this.name}}</strong>
          des Adapters <strong class="nummer-name-dataset">{{this.typeAdapter}}</strong> bearbeiten . <br>
          Bitte füllen Sie alle Felder aus.
        </p>
        <p v-else class="card-text">
            Datenquelle für den Adapter <strong class="nummer-name-dataset">{{this.typeAdapter}}</strong> registrieren.<br>
            Bitte füllen Sie alle Felder aus.
        </p>
        <p>
          <v-text-field label="Data Source Name" v-model="name" required></v-text-field>
        </p>
        <p>
          <v-text-field label="Data Source Type" v-model="type" required readonly></v-text-field>
        </p>
      </v-card-text>
    </v-card>
    <div class="row">
        <ncform :form-schema="formSchema" form-name="dataInput" v-model="formSchema.value"></ncform>
    </div>
    <div class="row" style="margin-left: auto ; margin-top: 20px;">
        <v-btn v-on:click="submit()" color="accent">Data Source hinzufügen</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateDataSource',
  props: ['sourceid','typeAdapter'],
  data() {
    return {
      type: "",
      name: null,
      id: null,
      formSchema: {
        type:"object",
        properties:{}
      },
      sources: []
    };
  },
  beforeMount(){
    this.querySources()
  },
  methods:{
    getFormSchema(){
      this.type = this.typeAdapter
      this.$axios({
        method: 'GET',
        url: new URL('/api/datasources/schema/type/'+this.typeAdapter, this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(response => {
        this.formSchema = response.data
        this.updateParams()
      })
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
          this.type = response.data.source.datasourcetype
          this.name = response.data.source.datasourcename
          this.formSchema.value = JSON.parse(response.data.source.data)
        })
      }
      else{
        this.name = null
        this.id = null
      }
    },
    submit(){
      let url;
      if(this.id === null){
        url = new URL('/api/datasources/add', this.$env.apiBaseUrl)
      }
      else{
        url = new URL('/api/datasources/edit/'+this.id, this.$env.apiBaseUrl)
      }
      this.$axios({
        method: 'POST',
        url: url,
        data: {
          datasourcetype: this.type,
          datasourcename: this.name,
          data: this.formSchema.value
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(response => {
        this.$store.dispatch('updateStatus',response.data)
        this.$router.push("/datasource/select")  
      })
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
        for( var i in response.data.sort() ){
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
        this.getFormSchema()
      })
    },
  }
}
</script>

<style>
  .__object-form-item{
      margin-top: 0px;
  }
  .form-control:disabled {
      background-color:#303030;
  }
  .nummer-name-dataset{
      color: #3498DB;
  }
  .ncform {
      width: 1000px;
  }
</style>