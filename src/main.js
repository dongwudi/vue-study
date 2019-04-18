import Vue from 'vue/dist/vue.esm';

//定义todo-item的组件
//注册全局组件的时候，需要放在Vue实例之前
Vue.component('todo-item',{
  props: ['list'],
  template: `<li>{{list.text}}</li>`
})

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js!',
    date: `页面加载于 ${new Date().toLocaleString()}`,
    seen: true,
    lists: [
      { text: '学习 JavaScript', id: 0 },
      { text: '学习 Vue' , id: 1},
      { text: '整个牛项目' , id: 2}
    ]
  },
  methods: {
    changeSeen () {
      this.seen = !this.seen;
      setTimeout(()=>{
        this.seen = true;
      },1000)
    },
    reverseMessage () {
      this.message = this.message.split('').reverse().join('')
    }
  }
});


window.app = app;
