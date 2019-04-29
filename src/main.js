import Vue from 'vue/dist/vue.esm';
import router from '../router';
import store from '../vuex';

const app = new Vue({
  el: '#app',
  router,
  data: {

  },
  computed: {
    count () {
	    return store.state.count
    }
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
    	store.commit('decrement')
    }
  }
});

window.app = app;
