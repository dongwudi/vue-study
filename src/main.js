import Vue from 'vue/dist/vue.esm';

Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <label for="checkbox">
      <input
        id="checkbox"
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="$emit('change', $event.target.checked)"
      >
      lovingVue--{{checked}}
    </label>
  `
})

Vue.component('base-input',{
  template: `<input type="text"/>`
})

Vue.component('base-inputlabel',{
  props:['lovingVue','value'],
  template: `
  <label for="input">
    <input
      id="input"
      v-bind="$attrs"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
    {{lovingVue}}
  </label>
  `
})

// $listeners
Vue.component('listener-input',{
  inheritAttrs: false,
  props: ['label','value'],
  computed: {
    inputListeners () {
      var vm = this;
      console.log(this.$listners)
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            // console.log(event)
            vm.$emit('input', event.target.value)
          }
        }
        )
    }
  },
  template: `
  <label>
    {{ label }}--    {{value}}
    <input
      v-bind="$attrs"
      v-bind:value="value"
      v-on="inputListeners"
    >
  </label>
  `
})

Vue.component('text-doc',{
  props:['title'],
  template: `<div @click="updateTitle">{{title}}</div>`,
  methods: {
    updateTitle(){
      this.$emit('update:title','this is new title')
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    lovingVue: true,
    value: 'please',
    tit: 'this is old title'
  },
  methods: {
    onFocus () {
      console.log(1)
    },
    updateFn($event) {
      console.log($event)
    }
  },
});

window.app = app;
