"use strict";

import Vue from 'vue';
import axios from "axios";
import app from '../main.js';

let config = {};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    app.$Progress.start();
    return config;
  },
  function(error) {
    // Do something with request error
    app.$Progress.fail();
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    app.$Progress.finish();
    return response;
  },
  function(error) {
    // Do something with response error
    app.$Progress.fail();
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin);

export default Plugin;
