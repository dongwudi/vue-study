import Vue from 'vue/dist/vue.esm';

// 声明全局组件
Vue.component('my-component',{
  template: `<p class="foo bar">Hi</p>`
})

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js!',
    isActive: true,
    hasError: true,
    classObject:{
      active: true,
      'text-danger': false
    },
    activeClass: 'active',
    errorClass: 'text-danger',
    activeColor: 'red',
    fontSize: 12,
    styleObject: {
      color: 'red',
      fontSize: '14px',
      transform: 'translateX(10px)',
      transition: 'transform 1s'
    },
    overridingStyles: {
      textDecorationLine: 'line-through'
    }
  },
  computed: {
    comClassObject () {
      return {
        active: this.isActive && !this.hasError,
        'text-danger': this.hasError
      }
    }
  }
});

window.app = app;
