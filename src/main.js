import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    awesome: true,
    type: 'A',
    typeArr: ['A','B','C'],
    loginType: 'username',
    ok: true,
    lists: [
      {'text':'A',isTrue: true,id:11},
      {'text':'B',isTrue: false,id:12},
      {'text':'C',isTrue: true,id:13}
    ]
  },
  mounted() {
   setInterval( () => {
    this.awesome = !this.awesome;
    let num = Math.floor(Math.random() * 4);
    console.log(num)
    this.type = this.typeArr[num]
   },3000) 
  },
  methods: {
   changeLoginType () {
     this.loginType = this.loginType === 'username' ? 'email' : 'username';
   } 
  }
});

window.app = app;
