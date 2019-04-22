import Vue from 'vue/dist/vue.esm';
import ComponentA from '../components/ComponentA';
import ComponentB from '../components/ComponentB';

import {upperFirst,camelCase} from 'lodash';
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
// var ComponentA = {
//   template: `<div>this is component-a</div>`
// }

//基础组件的自动化全局注册
const requireComponent = require.context(
  '../components',
  //是否查询其子目录
  false,
  // 匹配基础组件文件名的规则
  /Base[A-Z]\w+\.(vue|js)$/
)

// console.log(Object.keys(requireComponent)) //keys resolve id

requireComponent.keys().forEach(fileName => {
  console.log(fileName)
  //获取组件配置
  const componentConfig = requireComponent(fileName)
  //获取组件的PascalCase命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

const app = new Vue({
  el: '#app',
  data: {

  },
  components : {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
});

window.app = app;
