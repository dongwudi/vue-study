export default {
  data () {
    return {
      num: 2
    }
  },
  name: 'child',
  template: `<div @click="logF">子组件-{{num}}</div>`,
  methods: {
    logF () {
      // console.log(this.$root)
      console.log(this.$parent)
      //修改它
      this.$root.foo = 2;

      console.log(this.cons)
    }
  },
  inject: ['cons']
}