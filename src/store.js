import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

let auth = {
  headers: {
    Authorization:{
      toString () {
        return `Bearer ${localStorage.getItem('jwt')}`;
      },
    },
  },
};

export default new Vuex.Store({
  state: {
    authToken: null,
    snackbar: false,
    status: null,
    text: null,
    sources: [],
  },
  mutations: {
    LOGIN(state, authToken) {
      state.authToken = authToken.jwt;
    },
    LOGOUT(state) {
      state.authToken = null;
    },
    UPDATE_STATUS(state, update) {
      state.snackbar = true;
      state.status = update.status;
      state.text = update.text;
    },
    SET_SNACKBAR(state, snackbar) {
      state.snackbar = snackbar;
    },
    SAVE_SOURCES(state, sources) {
      state.sources = sources;
    },
  },
  getters: {
    getAuthToken: state => state.authToken,
    getSnackbar: state => state.snackbar,
    getStatus: state => state.status,
    getText: state => state.text,
    getSources:state => state.sources,
  },
  actions: {
    login(context, authToken) {
      context.commit('LOGIN', authToken);
    },
    logout(context) {
      context.commit('LOGOUT');
    },
    updateStatus(context, update) {
      context.commit('UPDATE_STATUS', update);
    },
    setSnackbar(context, snackbar) {
      context.commit('SET_SNACKBAR', snackbar);
    },
    loadSources:({ commit }, config) => {
      Vue.axios.get(new URL('/api/listAdapters', config.apiBase), auth).then(result => {
        let adpts = [], adapterNames = [];
        for( var i in result.data.sort()){
          adapterNames.push(result.data[i].name);
        }
        for( var j in adapterNames){
          Vue.axios.get(new URL('/api/datasources/find/type/' + adapterNames[j], config.apiBase), auth).then(adapt => {
            adpts.push({
              type: adapt.data.type,
              sources: adapt.data.result,
            })
          });
        }
        commit('SAVE_SOURCES', adpts);
      }).catch(error => {
        throw new Error(`API ${error}`);
      });
    },
  },
});
