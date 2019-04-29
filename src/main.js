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

console.log(store.state.a.count);
// console.log(store.state.b.count);
store.commit('a/increment');
console.log(store.state.a.count);
console.log(store.getters['a/doubleCount']);
store.dispatch('a/incrementIfOddOnRootSum');
console.log(store.state.a.count);