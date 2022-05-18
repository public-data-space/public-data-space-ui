import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    dataAssetItem: null,
};

const mutations = {
    saveDataAssetItem(state, item) {
        state.dataAssetItem = item;
    },
};

export default {
    state,
    mutations,
}