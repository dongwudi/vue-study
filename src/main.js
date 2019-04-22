import Vue from 'vue/dist/vue.esm';

// 全局注册
// 全局注册的组件可以用在任何新创建的Vue根实例的模板中，以及所有子组件中
Vue.component('my-component',{
  template: `
    <div>
      <div>this is a my-componet</div>
      <slot></slot>
    </div>
  `
})

Vue.component('my-component-b',{
  template: `<div>this is a my-componet-b</div>`
})

// 局部注册
// 如果使用webpack构建工具，全局注册会导致不使用此组件依然被包含进入构建文件中
// ComponentA --> components: {'component-a':ComponentA}
// 局部注册的组件在其子组件中不可用
// 如果希望 ComponentA 在 ComponentB 中可用
// 必须要在B中注册才可以使用
var ComponentA = {
  template: `<div>this is component-a</div>`
}

const app = new Vue({
  el: '#app',
  data: {

  },
  components : {
    'component-a': ComponentA
  }
});

window.app = app;
