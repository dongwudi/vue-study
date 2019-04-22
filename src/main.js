import Vue from 'vue/dist/vue.esm';

Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})

// 对象形式的props类型,指定props类型
Vue.component('props-o', {
  // 在 JavaScript 中是 camelCase 的
  props: {
    title: String,
    num: Number
  },
  template: '<h3>{{ title }}----{{num}}</h3>'
})

// 单向数据流
// 不应该在子组件中修改prop
// 可以将其作为本地数据进行修改，或者使用计算属性
Vue.component('props-p', {
  props: ['number'],
  template: '<h3>{{counter}}--{{comcounter}}</h3>',
  data () {
    return {
      counter : this.number
    }
  },
  computed: {
    comcounter () {
      let count = this.number;
      return count.toString().split('').sort().join('')
    }
  }
})

// 验证要求
// 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
Vue.component('props-y', {
  props: {
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  },
  template: `<div>{{propA}}--{{propC}}--{{propD}}</div>`
})

// 禁用特性继承 inheritAttrs: false
// 尤其适合配合实例的 $attrs 属性使用，该属性包含了传递给一个组件的特性名和特性值
// $attrs 将父组件属性传递给子组件 -- 除去props中的属性
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `,
  created () {
    console.log(this.$attrs)
    //{aa: "this is aa", placeholder: "Enter your username"}
  }
})

const app = new Vue({
  el: '#app',
  data: {
    number: 1
  }
});

window.app = app;
