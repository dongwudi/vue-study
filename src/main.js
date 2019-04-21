import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    message: '',
    checked: true,
    checkedNames: [],
    picked: '',
    selected: 'A',
    selectedarr:[],
    options: [
      { text: 'One', value: 'A' },
      { text: 'Two', value: 'B' },
      { text: 'Three', value: 'C' }
    ],
    radiostr:'',
    toggle:false,
    msg:'msg',
    age: 1
  }
});

window.app = app;
