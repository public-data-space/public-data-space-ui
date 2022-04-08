<template>
  <v-card hover>
    <v-card-text>
      Bitte wählen sie eine Datenquelle, aus der ein weiteres Data Asset hinzugefügt werden soll, aus der Liste, oder klicken Sie auf das Kreuz um eine weitere Datenquelle des Typs hinzuzufügen.
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SelectDataSource',
  components: {},
  data() {
    return {
      sources: [],
    };
  },
  methods:{
    deleteAction(id){
      this.sources = [];
      this.$axios({
        method: 'DELETE',
        url: new URL('/api/datasources/delete/'+id, this.$env.apiBaseUrl),
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        this.querySources();
        this.$store.dispatch('updateStatus',response.data);
        this.$router.go();
      });
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
        for( var i in response.data){
          var adapter = response.data[i]
            this.$axios({
              method: 'GET',
              url: new URL('/api/datasources/find/type/'+adapter.name, this.$env.apiBaseUrl),
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
              },
          })
          .then(response2 => {
            this.sources.push({
              type: response2.data.type,
              sources: response2.data.result
            })
          })
          .catch(error2 => {
            if(error2.response.status === 401){
                this.$store.dispatch('updateStatus', {'status': 'error', 'text': 'Session expired.' });
                this.$router.push('/login');                      
            }
          });
        }
      });
    },
  },
  created(){
    this.querySources()
  },
};
</script>
<style>
#content{
    width: 100%;
    margin-left: 50px;
}
.__object-form-item{
    margin-top: 0px;
}
</style>