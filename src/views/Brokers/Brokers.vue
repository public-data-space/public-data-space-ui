<template>
  <div class="row">
    <div class="col-lg-12">
      <v-card>
        <v-card-title style="color:#E96A22">{{ title }}</v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">URL</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="broker in brokers" v-bind:key="broker.id">
                  <td>{{ broker.id }}</td>
                  <td>{{ broker.url }}</td>
                  <td>
                      <span v-if="broker.status === 'REGISTERED'">
                          <span class="badge badge-success">Registriert</span>
                      </span>
                      <span v-if="broker.status === 'UNREGISTERED'">
                          <span class="badge badge-info">Nicht registriert</span>
                      </span>
                  </td>
                  <td>
                    <v-btn icon @click="toggleBroker(broker.id, broker.status)">
                      <v-icon v-if="broker.status === 'REGISTERED'" title="Abmelden">mdi-close</v-icon>
                      <v-icon v-else title="Anmelden">mdi-check</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteBroker(broker.id)" title="Löschen"><v-icon>mdi-delete</v-icon></v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
          
      <br>
      <br>

      <v-card hover>
        <v-card-title style="color:#E96A22">{{ addNewBroker }}</v-card-title>
        <v-card-subtitle>
          <v-text-field v-model="brokerUrl" label="Broker URL" append-icon="mdi-plus" @click:append="submit" @keyup.enter="submit"></v-text-field>
        </v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: 'Brokers',
  data() {
    return {
      title: GLUE_CONFIG.brokers.title,
      addNewBroker: GLUE_CONFIG.brokers.addNewBroker,
      brokers: [],
      brokerStatus: {
        REGISTERED: 'UNREGISTERED',
        UNREGISTERED: 'REGISTERED',
      },
      brokerUrl: null,
      snackbarTextSubmitSuccess: GLUE_CONFIG.snackbarTexts.brokers.submit.success,
      snackbarTextSubmitError: GLUE_CONFIG.snackbarTexts.brokers.submit.error,
      snackbarTextSubmitInput: GLUE_CONFIG.snackbarTexts.brokers.submit.input,
      snackbarTextToggleSuccess: GLUE_CONFIG.snackbarTexts.brokers.toggle.success,
      snackbarTextDeleteSuccess: GLUE_CONFIG.snackbarTexts.brokers.delete.success,
    };
  },
  methods:{
    submit(){
      if (this.brokerUrl) {
        this.$axios({
          method: 'POST',
          url: new URL('/api/broker/add', this.$env.apiBaseUrl),
          data: {
            url: this.brokerUrl
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then(response => {
          this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextSubmitSuccess })
          this.findBroker()
          this.brokerUrl = null;
        })
        .catch(() => {
          this.$store.dispatch('updateStatus', { status: 'error', text: this.snackbarTextSubmitError });                       
        })  
      } else {
        this.$store.dispatch('updateStatus', { status: 'error', text: this.snackbarTextSubmitInput });
      }
    },
    toggleBroker(id, status){
      this.$axios({
        method: 'GET',
        url: new URL(`/api/broker/${status === 'REGISTERED' ? 'un' : ''}register/${id}`, this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
      .then(response => {
        this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextToggleSuccess });
        this.findBroker();
      }); 
    },
    findBroker(){
      this.$axios({
        method: 'GET',
        url: new URL('/api/broker/findAll', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        this.brokers = response.data;
      });
    },
    deleteBroker(id){
      this.$axios({
        method: 'DELETE',
        url: new URL(`/api/broker/delete/${id}`, this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
      .then(response => {
        this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextDeleteSuccess });
        this.findBroker();
      });
    },
  },
  created(){
    this.findBroker()
  },
};
</script>

<style>
td {
  text-align: center;
}
</style>