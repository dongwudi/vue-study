import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js!',
    rawHtml: '<span style="color:red;">this is span</span>',
    dynamicId: 'tx',
    isButtonDisabled: true ,//null undefined false
    number: 1,
    ok: true,
    url: 'https://www.baidu.com',
    attributename: 'href', // 全小写
    eventname: 'click'
  },
  methods: {
    doSomething () {
      console.log('v-on')
    },
    onSubmit () {
      console.log('prevent')
    }
  }
});

window.app = app;
