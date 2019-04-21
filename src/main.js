import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    counter: 0,
    n: 0
  },
  methods: {
    addCounter (ev) {
      console.log(ev.target.tagName)
      this.counter ++;
    },
    addCounter1 (n) {
      this.n = n;
      this.counter += n;
    },
    doThis () {
      console.log('dothis')
    },
    do1(){
      console.log('do')
    },
    dothat(){
      console.log('dothat')
    },
    dononce(){
      console.log('doonce')
    },
    scrollev(){
      console.log('1')
    },
    keyenv(){
      console.log('keyup')
    }
  }
});

window.app = app;
