import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js!',
    rem: '',
    firstName: 'dong',
    lastName: 'wudi'
  },
  computed: {
    reversedMessage () {
      return this.message.split('').reverse().join('')
    },
    now () {
      return Date.now()
    },
    fullName: {
      // getter
      get () {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set (newVal) {
        let name = newVal.split(' ');
        this.firstName = name[0];
        this.lastName = name[name.length - 1];
      }
    }
  },
  methods: {
    reversedMessageF () {
      return this.message.split('').reverse().join('')
    }
  },
  //初始时不会触发，只有message更新时才会执行
  watch: {
    message (val) {
      this.rem = val.split('').reverse().join('')
    }
  }
});

window.app = app;
