export default {
  template: `<div>
  $route.params-->{{$route.params}}
  <br/>
  user:id-->{{$route.params.id}}
  </div>`,
  // /user/foo 导航到 /user/bar  原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用
  // 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象 或者使用 导航守卫 beforeRouteUpdate
  watch: {
    '$route' (to, from) {
      // console.log('-----------------to----------------------')
      // console.log(to)
      // console.log('-----------------to----------------------')
      // console.log('-----------------from----------------------')
      // console.log(from)
      // console.log('-----------------from----------------------')
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('-----------------to----------------------')
    console.log(to)
    console.log('-----------------to----------------------')
    console.log('-----------------from----------------------')
    console.log(from)
    console.log('-----------------from----------------------')

    // don't forget to call next()
    next();
  }
}