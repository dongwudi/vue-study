import Vue from 'vue/dist/vue.esm';

Vue.component('my-c',{
  props: ['msg'],
  template: `<li>this is my-c {{msg}}</li>`
})

const app = new Vue({
  el: '#app',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ],
    object: {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    },
    numbers: [1,2,3,4,5]
  },
  computed: {
    eventNumbers: function() {
      return this.numbers.filter((number)=>{
        return number % 2 === 0
      })
    }
  },
  methods: {
    even: function (numbers) {
      return numbers.filter((number)=>{
        return number % 2 === 0
      })
    }
  },
});

window.app = app;
