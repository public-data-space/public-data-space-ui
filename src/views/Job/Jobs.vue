<template>
  <div>
    <v-card>
      <v-card-title style="color:#E96A22">{{ title }}</v-card-title>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Resource</th>
                <th scope="col">Erstellt</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="job in jobs" v-bind:key="job.id">
                <th scope="row">{{job.id}}</th>
                <td>{{job.resourceid}}</td>
                <td>{{new Date(Date.parse(job.created_at)).toLocaleString()}}</td>
                <td>
                  <!--CREATED-->
                  <span v-if="job.status == 0">
                    <span class="badge badge-primary">Erstellt</span>
                  </span>
                  <!--FINISHED-->
                  <span v-if="job.status == 2">
                    <span class="badge badge-success">Fertig</span>
                  </span>
                  <!--ERROR-->
                  <span v-if="job.status == 3">
                    <span class="badge badge-danger">Fehler</span>
                  </span>
                  <!--RUNNING-->
                  <span v-if="job.status == 1">
                    <span class="badge badge-info">Wird ausgeführt</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>      
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-on:click="deleteAction" color="accent">
          Jobs aufräumen
          <v-icon right>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { glueConfig as GLUE_CONFIG } from '../../../config/user-config';

export default {
  name: 'Jobs',
  data() {
    return {
      jobs: null,
      title: GLUE_CONFIG.jobs.title,
      snackbarTextDeleteSuccess: GLUE_CONFIG.snackbarTexts.jobs.delete.success,
    };
  },
  methods:{
    findAll () {
      this.$axios({
        method: 'GET',
        url: new URL('/api/jobs/find/all', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
      })
      .then(response => {
        this.jobs = response.data;
        //Repeat this function until there are no more jobs with the status "running"
        for (var i = 0; i < this.jobs.length; i++){
          var job = this.jobs[i];
          if (job.status == 1) {
            this.findAll();
          }
        }
      });
    },
    deleteAction (){
      this.$axios({
        method: 'DELETE',
        url: new URL('/api/jobs/delete/all', this.$env.apiBaseUrl),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        }
      })
      .then(response => {
        this.$store.dispatch('updateStatus', { status: response.data.status, text: this.snackbarTextDeleteSuccess });
        this.findAll();
      });
    },
  },
  created (){
    this.findAll();
  },
};
</script>
