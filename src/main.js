import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    show: true
  }
});

window.app = app;
