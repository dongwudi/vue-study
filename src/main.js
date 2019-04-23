import Vue from 'vue/dist/vue.esm';

import ChildCom from '../components/ChildCom';
import ParentCom from '../components/ParentCom';
import StaticCom from '../components/StaticCom'

const app = new Vue({
  el: '#app',
  data: {
    foo: 1
  },
  computed: {
    bar () {
      return this.foo + 1;
    }
  },
  methods: {
    baz () {
      console.log('baz')
    },
    cons () {
      console.log(this.$refs.childref)
      this.$refs.childref.num = 12;
    }
  },
  components: {
    ChildCom,
    ParentCom,
    StaticCom
  },
  // 更深层级的嵌套组件上可以通过 provide inject来解决交互问题
  //provide  允许我们指定我们想要提供给后代组件的数据/方法
  //在任何后代组件中 使用inject来接收要使用的指定方法 
  provide: function () {
    return {
      cons: this.cons
    }
  }
});

window.app = app;
