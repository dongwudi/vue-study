import Vue from 'vue/dist/vue.esm';

Vue.component('navigation-link',{
  props:['url'],
  template: `
    <a
      v-bind:href="url"
      class="nav-link"
    >
      <slot></slot>
    </a>
`
})

// 后备内容
// 在父级组件中使用此组件并且不提供任何插槽内容时，
// 后备内容被渲染，提供内容则提供的内容将取代后备内容
Vue.component('navigation-link1',{
  props:['url'],
  template: `
    <a
      v-bind:href="url"
      class="nav-link"
    >
      <slot>后备内容</slot>
    </a>
`
})

// 具名插槽
// 一个不带 name 的 <slot> 出口会带有隐含的名字“default”
Vue.component('navigation-link2',{
  props:[],
  template: `
    <div>
      <div class="header"><slot name="header"></slot></div>
      <slot name="main"></slot>
      <slot name="footer"></slot>
      <slot></slot>
    </div>
`
})

// 插槽 prop
Vue.component('navigation-link3',{
  data () {
    return {
      user: {
        firstName:"dong",
        lastName:"wd"
      },
      other: {
        a: 1
      }
    }
  },
  props:[],
  // 为了让 user 在父级的插槽内容可用，我们可以将 user 作为一个 <slot> 元素的特性绑定上去
  // 然后在父级作用域中，我们可以给 v-slot 带一个值来定义我们提供的插槽 prop 的名字
  template: `
    <div>
      <slot name="main" v-bind:user="user">{{user.firstName}}</slot>
      <slot v-bind:user="user" ></slot>
    </div>
`
})

const app = new Vue({
  el: '#app',
  data: {
    dtname: 'main'
  }
});

window.app = app;
