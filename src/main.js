import Vue from 'vue/dist/vue.esm';

const app = new Vue({
  el: '#app',
  data: {
    message: 'hello vue.js!'
  },
  methods: {
    changeMessage() {
      this.message = 'update hello vuejs'
    },
    destroy(){
      this.$destroy()
    }
  },
  beforeCreate() {
    console.group(`beforeCreate --- this.message is %c ${this.message}`,"color:red")
    console.log('%c%s',"color:red",`组件实例刚被创建，组件属性计算之前，如data属性`)
    console.groupEnd();
  },
  created () {
    console.group(`created --- this.message is %c ${this.message}`,"color:red")
    console.group(`created --- this.$el is %c ${this.$el}`,"color:red")
    console.log('%c%s',"color:red",`组件实例创建完成，属性已经绑定，DOM还未生成，$el属性还不存在`)
    console.groupEnd();
  },
  beforeMount() {
    console.group(`beforeMount --- app.innerHtml is %c ${document.getElementById('app').innerHTML}`,"color:red")
    console.group(`created --- this.$el is %c ${this.$el}`,"color:red")
    console.log('%c%s',"color:red",`模板编译/挂载之前`)
    console.groupEnd();
  },
  mounted() {
    console.group(`mounted --- app.innerHtml is %c ${document.getElementById('app').innerHTML}`,"color:red")
    console.log('%c%s',"color:red",`模板编译/挂载之后`)
    console.groupEnd();
  },
  beforeUpdate() {
    console.group('beforeUpdate----------')
    console.log('%c%s',"color:red",`el: ${this.$el.innerHTML}`)
    console.log('%c%s',"color:red",`this.message: ${this.message}`)
    console.log('%c%s',"color:red",`message已经为更新后的数据，但是DOM还没有更新，组件更新之前`)
    console.groupEnd();
  },
  updated() {
    console.group('updated----------')
    console.log('%c%s',"color:red",`el: ${this.$el.innerHTML}`)
    console.log('%c%s',"color:red",`this.message: ${this.message}`)
    console.log('%c%s',"color:red",`组件更新之后`)
    console.groupEnd();
  },
  beforeDestroy() {
    console.group(`beforeDestroy --- app._isVue is %c ${this._isVue}`,"color:red")
    console.log('%c%s',"color:red",`组件销毁前调用`)
    console.groupEnd();
  },
  destroyed() {
    console.group(`destroyed --- app._isVue is %c ${this._isVue}`,"color:red")
    console.log('%c%s',"color:red",`组件销毁后调用，vue控制失效`)
    setTimeout(()=>{
      this.message = 'destroyed'
      console.log('%c%s',"color:red",`${this.message}`)
      console.log('%c%s',"color:red",`dom中的message并没有变化，${this.$el.innerHTML}`)
    },1000)
    console.groupEnd();
  }
});

window.app = app;
