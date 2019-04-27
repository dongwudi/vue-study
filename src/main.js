import Vue from 'vue/dist/vue.esm';
import router from '../router';

const app = new Vue({
  el: '#app',
  router,
  data: {

  }
});

window.app = app;
