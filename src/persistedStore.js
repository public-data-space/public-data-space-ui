import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state = {
    dataAssetItem: null,
    dataAssetDataSourceType: '',
    dataAssetDataSourceName: ''
};

const mutations = {
    saveDataAssetItem(state, item) {
        state.dataAssetItem = item;
    },
    saveDataAssetDataSourceType(state, type) {
        state.dataAssetDataSourceType = type;
    },
    saveDataAssetDataSourceName(state, name) {
        state.dataAssetDataSourceName = name;
    },
    saveTags(state, tags) {
        state.dataAssetItem.tags = tags;
    }
};

export default {
    state,
    mutations,
}
