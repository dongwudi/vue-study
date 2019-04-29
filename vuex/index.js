import Vue from 'vue/dist/vue.esm';
import Vuex from 'vuex';

import moduleA from './moduleA';
import moduleB from './moduleB';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  },
  state: {
    count: 3
  },
  getters:{

  },
  mutations: {

  },
  actions: {

  }
})

export default store;
