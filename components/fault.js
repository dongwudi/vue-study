export default {
  props: ['id'],
  template: `
  <div>
    使用 props 将组件和路由解耦
    <br>
    // default {{$route.params.id}}
    default {{id}}
  </div>`,
  mounted() {
    console.log(this)
  },
}