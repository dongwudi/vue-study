import Vue from 'vue/dist/vue.esm';
import router from '../router';

const app = new Vue({
  el: '#app',
  router,
  data: {
    
  },
  mounted() {
    console.log(this.$route)
    console.log(this.$router)
  },
});

window.app = app;
