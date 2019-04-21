import Vue from 'vue/dist/vue.esm';

// 定义一个全局组件
// 定义组件时，data必须时一个函数
// 因此每个实例可以维护一份被返回对象的独立的拷贝

Vue.component('button-counter',{
  template: `<button v-on:click="count++">You clicked me {{ count }} times.</button>`,
  data () {
    return {
      count: 0
    }
  }
})

// Vue.component('blog-post',{
//   //必须时一个数组
//   props: ['title'],
//   data () {
//     return {
//       content: '<div>this is content</div>'
//     }
//   },
//   //单个根元素 
//   template: `<div class="blog-post">
//                 <h3>{{ title }}</h3>
//                 <div v-html="content"></div>
//               </div>`
// })

// 子组件通过$emit触发父级enlarge-text事件，
// 父组件监听自定义事件触发相应方法
// 也可以在子组件中添加参数，父级组件通过$event获取
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button v-on:click="$emit('enlarge-text',0.2)">
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})

// v-model在组件上的使用
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})


// 插槽
Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})

Vue.component('isli',{
  template:"<li>li</li>"
})

const app = new Vue({
  el: '#app',
  data: {
    title: '这是一个标题',
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' }
    ],
    postFontSize: 1,
    searchText: ''
  }
});

window.app = app;
