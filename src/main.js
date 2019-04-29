import Vue from 'vue/dist/vue.esm';
import router from '../router';
import store from '../vuex';
import App from '../components/App';

new Vue({
  el: '#app',
  router,
  store,
  components:{
    App
  }
});

