import Vue from 'vue/dist/vue.esm';

import PostsCom from '../components/PostsCom';
import ArchiveCim from '../components/ArchiveCim';

// Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。
// Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染
// Vue.component('async-example',function(resolve, reject){
//   setTimeout(function () {
//     // 向 `resolve` 回调传递组件定义
//     resolve({
//       template: '<div>I am async!</div>'
//     })
//   }, 1000)
// })

// Vue.component('async-webpack-example', function (resolve) {
//   // 这个特殊的 `require` 语法将会告诉 webpack
//   // 自动将你的构建代码切割成多个包，这些包
//   // 会通过 Ajax 请求加载
//   require(['../components/my-async-component'], resolve)
// })


Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('../components/my-async-component')
)

const app = new Vue({
  el: '#app',
  data: {
    currentTabComponent: 'archive-cim'
  },
  components:{
    PostsCom,
    ArchiveCim
  }
});

window.app = app;
